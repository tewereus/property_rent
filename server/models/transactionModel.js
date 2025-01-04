const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    transactionType: {
      type: String,
      enum: ["purchase", "rent", "boost"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "mortgage"],
      required: true,
    },
    transactionDetails: {
      paymentId: String,
      paymentDate: Date,
      receiptNumber: String,
    },
    notes: {
      type: String,
    },
    documents: [
      {
        type: String,
        required: false,
      },
    ],
    duration: {
      // For rental properties
      startDate: Date,
      endDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
