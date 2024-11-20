const asyncHandler = require("express-async-handler");
const Transaction = require("../models/transactionModel");
const Property = require("../models/propertyModel");
const User = require("../models/userModel");

// Create a new transaction
const createTransaction = asyncHandler(async (req, res) => {
  const { propertyId, paymentMethod, notes } = req.body;
  const buyerId = req.user.id;

  try {
    // Get property details
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.status !== "available") {
      return res.status(400).json({ message: "Property is not available" });
    }

    // Create transaction
    const transaction = await Transaction.create({
      property: propertyId,
      buyer: buyerId,
      seller: property.owner,
      amount: property.price,
      paymentMethod,
      notes,
      transactionDetails: {
        paymentDate: new Date(),
        receiptNumber: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      },
    });

    // Update property status
    property.status = "pending";
    await property.save();

    // Populate references
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("property")
      .populate("buyer", "name email")
      .populate("seller", "name email");

    res.status(201).json(populatedTransaction);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all transactions for a user (either as buyer or seller)
const getUserTransactions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  console.log("first");

  try {
    const transactions = await Transaction.find({
      $or: [{ buyer: userId }, { seller: userId }],
    })
      .populate({
        path: "property",
        select: "title description price location images property_use status",
      })
      .populate({
        path: "buyer",
        select: "name email",
      })
      .populate({
        path: "seller",
        select: "name email",
      })
      .sort("-createdAt");
    console.log("second");
    // Add a field to indicate if the current user is the buyer or seller
    const transformedTransactions = transactions.map((transaction) => {
      const plainTransaction = transaction.toObject();
      plainTransaction.userRole =
        transaction.buyer._id.toString() === userId ? "buyer" : "seller";
      return plainTransaction;
    });
    console.log("third");

    res.json(transformedTransactions);
  } catch (error) {
    throw new Error(error);
  }
});

// Get transaction by ID
const getTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id)
      .populate("property")
      .populate("buyer", "name email")
      .populate("seller", "name email");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Check if user is authorized to view this transaction
    if (
      transaction.buyer.toString() !== req.user.id &&
      transaction.seller.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(transaction);
  } catch (error) {
    throw new Error(error);
  }
});

// Update transaction status
const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Only allow seller to update transaction status
    if (transaction.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    transaction.status = status;
    if (notes) transaction.notes = notes;

    // If transaction is completed, update property status
    if (status === "completed") {
      const property = await Property.findById(transaction.property);
      property.status = "sold";
      property.buyer = transaction.buyer;
      await property.save();
    }

    await transaction.save();

    const updatedTransaction = await Transaction.findById(id)
      .populate("property")
      .populate("buyer", "name email")
      .populate("seller", "name email");

    res.json(updatedTransaction);
  } catch (error) {
    throw new Error(error);
  }
});

// Cancel transaction
const cancelTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Only buyer or seller can cancel
    if (
      transaction.buyer.toString() !== req.user.id &&
      transaction.seller.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Can only cancel pending transactions
    if (transaction.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot cancel this transaction" });
    }

    transaction.status = "cancelled";
    transaction.notes = reason;
    await transaction.save();

    // Update property status back to available
    const property = await Property.findById(transaction.property);
    property.status = "available";
    await property.save();

    res.json({ message: "Transaction cancelled successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createTransaction,
  getUserTransactions,
  getTransaction,
  updateTransactionStatus,
  cancelTransaction,
};
