const asyncHandler = require("express-async-handler");
const request = require("request");
const { Property } = require("../models/propertyModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

const initializePayment = asyncHandler(async (req, res) => {
  try {
    console.log("1. Starting payment initialization");
    const { amount, propertyId, paymentMethod, transactionType } = req.body;
    const { id } = req.user;

    // Validate required fields
    if (!amount || !propertyId || !paymentMethod || !transactionType) {
      return res.status(400).json({
        message: "Missing required fields",
        details: { amount, propertyId, paymentMethod, transactionType },
      });
    }

    // Validate property exists
    const property = await Property.findById(propertyId).exec();
    console.log("3. Found property:", property ? "Yes" : "No");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // For boost payments, don't check property status
    // if (transactionType !== "boost" && property.status !== "available") {
    //   return res.status(400).json({ message: "Property is not available" });
    // }

    // Validate Chapa API key
    if (!process.env.CHAPA_SECRET_KEY) {
      console.error("Chapa API key is missing");
      return res.status(500).json({ message: "Payment configuration error" });
    }

    // Get user details from database to ensure valid data
    const user = await User.findById(id).select("name email phone").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format user name
    const nameParts = user.name.split(" ");
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.slice(1).join(" ") || "Customer";

    const tx_ref = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Setup Chapa request options
    const options = {
      method: "POST",
      url: "https://api.chapa.co/v1/transaction/initialize",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: "ETB",
        email: "abebech_bekele@gmail.com",
        first_name: firstName,
        last_name: lastName,
        phone_number: user.phone || "0912345678",
        tx_ref: tx_ref,
        callback_url: "http://localhost:4884/api/v1/payment/verify",
        // return_url: `http://192.168.1.6:4884/api/v1/payment-webview`,
        "customization[title]": `Property ${transactionType}`,
        "customization[description]": `Payment for property ${transactionType}`,
      }),
    };

    console.log("Request options:", options);

    // Make request to Chapa
    return new Promise((resolve, reject) => {
      request(options, async function (error, chapaResponse) {
        if (error) {
          console.error("Chapa Error:", error);
          return res.status(500).json({
            message: "Payment initialization failed",
            error: error.message,
          });
        }

        try {
          const responseData = JSON.parse(chapaResponse.body);
          console.log("Chapa Response:", responseData);

          if (
            responseData.status === "success" &&
            responseData.data?.checkout_url
          ) {
            // Create pending transaction
            const transaction = await Transaction.create({
              property: propertyId,
              buyer: id,
              seller: property.owner,
              amount: amount,
              paymentMethod,
              transactionType,
              status: "pending",
              transactionDetails: {
                paymentDate: new Date(),
                receiptNumber: responseData.data.reference,
                tx_ref: responseData.data.tx_ref,
              },
            });

            return res.json({
              paymentUrl: responseData.data.checkout_url,
              reference: responseData.data.reference,
              tx_ref,
              transaction: transaction._id,
            });
          } else {
            return res.status(400).json({
              message: "Payment initialization failed",
              details: responseData.message,
            });
          }
        } catch (parseError) {
          console.error("Response parsing error:", parseError);
          return res.status(500).json({
            message: "Failed to process payment provider response",
            error: parseError.message,
          });
        }
      });
    });
  } catch (error) {
    console.error("Payment Error Details:", error);
    return res.status(500).json({
      message: error.message || "Failed to initialize payment",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// const verifyPayment = asyncHandler(async (req, res) => {
//   const { reference } = req.params;

//   try {
//     // Verify payment with Chapa
//     const response = await axios.get(
//       `https://api.chapa.co/v1/transaction/verify/${reference}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
//         },
//       }
//     );

//     if (response.data.status === "success") {
//       // Find and update transaction
//       const transaction = await Transaction.findOne({
//         "transactionDetails.receiptNumber": reference,
//       });

//       if (!transaction) {
//         return res.status(404).json({ message: "Transaction not found" });
//       }

//       // Update transaction status
//       transaction.status = "completed";
//       await transaction.save();

//       // Update property status
//       const property = await Property.findById(transaction.property);
//       if (property) {
//         if (transaction.transactionType === "purchase") {
//           property.status = "sold";
//         } else if (transaction.transactionType === "rent") {
//           property.status = "rented";
//         }
//         property.transactionHistory.push(transaction._id);
//         await property.save();
//       }

//       res.json({
//         status: "success",
//         message: "Payment verified successfully",
//         transaction,
//       });
//     } else {
//       res.status(400).json({
//         status: "failed",
//         message: "Payment verification failed",
//       });
//     }
//   } catch (error) {
//     console.error("Verification Error:", error);
//     res.status(500).json({
//       message: error.response?.data?.message || "Payment verification failed",
//     });
//   }
// });

const verifyPayment = asyncHandler(async (req, res) => {
  const { reference } = req.params; // Get transaction reference from request body
  console.log(req.params);
  // Call Chapa's verify endpoint
  const options = {
    method: "GET",
    url: `https://api.chapa.co/v1/transaction/verify/${reference}`,
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    },
  };

  request(options, (error, chapaResponse) => {
    if (error) {
      return res.status(500).json({ message: "Verification failed", error });
    }

    const responseData = JSON.parse(chapaResponse.body);
    console.log(responseData);
    if (responseData.status === "success") {
      // Handle successful verification
      console.log("Payment verified:", responseData);
      // Update transaction status in your database
      return res.json({ message: "Payment verified", data: responseData });
    } else {
      return res
        .status(400)
        .json({ message: "Payment not verified", details: responseData });
    }
  });
});

const postPayment = asyncHandler(async (req, res) => {
  try {
    console.log("1. Starting payment initialization");
    const { amount, paymentMethod, transactionType } = req.body;
    const { id } = req.user;

    // Validate required fields
    if (!amount || !paymentMethod || !transactionType) {
      return res.status(400).json({
        message: "Missing required fields",
        details: { amount, paymentMethod, transactionType },
      });
    }

    // Validate Chapa API key
    if (!process.env.CHAPA_SECRET_KEY) {
      console.error("Chapa API key is missing");
      return res.status(500).json({ message: "Payment configuration error" });
    }

    // Get user details from database to ensure valid data
    const user = await User.findById(id).select("name email phone").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format user name
    const nameParts = user.name.split(" ");
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.slice(1).join(" ") || "Customer";

    const tx_ref = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Setup Chapa request options
    const options = {
      method: "POST",
      url: "https://api.chapa.co/v1/transaction/initialize",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: "ETB",
        email: "abebech_bekele@gmail.com",
        first_name: firstName,
        last_name: lastName,
        phone_number: user.phone || "0912345678",
        tx_ref: tx_ref,
        callback_url: "http://localhost:4884/api/v1/payment/verify",
        // return_url: `http://192.168.1.6:4884/api/v1/payment-webview`,
        "customization[title]": `Property ${transactionType}`,
        "customization[description]": `Payment for property ${transactionType}`,
      }),
    };

    console.log("Request options:", options);

    // Make request to Chapa
    return new Promise((resolve, reject) => {
      request(options, async function (error, chapaResponse) {
        if (error) {
          console.error("Chapa Error:", error);
          return res.status(500).json({
            message: "Payment initialization failed",
            error: error.message,
          });
        }

        try {
          const responseData = JSON.parse(chapaResponse.body);
          console.log("Chapa Response:", responseData);

          if (
            responseData.status === "success" &&
            responseData.data?.checkout_url
          ) {
            const newProperty = await Property.create({
              ...propertyData, // Assuming propertyData contains all required fields for the property
              owner: id, // Set the user who made the payment as the owner of the property
            });

            // Create pending transaction
            const transaction = await Transaction.create({
              property: propertyId,
              buyer: id,
              seller: property.owner,
              amount: amount,
              paymentMethod,
              transactionType,
              status: "pending",
              transactionDetails: {
                paymentDate: new Date(),
                receiptNumber: responseData.data.reference,
                tx_ref: responseData.data.tx_ref,
              },
            });

            return res.json({
              paymentUrl: responseData.data.checkout_url,
              reference: responseData.data.reference,
              tx_ref,
              transaction: transaction._id,
            });
          } else {
            return res.status(400).json({
              message: "Payment initialization failed",
              details: responseData.message,
            });
          }
        } catch (parseError) {
          console.error("Response parsing error:", parseError);
          return res.status(500).json({
            message: "Failed to process payment provider response",
            error: parseError.message,
          });
        }
      });
    });
  } catch (error) {
    console.error("Payment Error Details:", error);
    return res.status(500).json({
      message: error.message || "Failed to initialize payment",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

module.exports = {
  initializePayment,
  verifyPayment,
};
