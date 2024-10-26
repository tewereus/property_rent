const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var carPropertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    fuel_type: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      required: true,
    },
    color: {
      type: String,
    },
    description: {
      type: String,
    },
    images: {
      type: [String], // Array of image URLs
    },
    status: {
      type: String,
      enum: ["available", "unavailable", "sold"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("CarProperty", carPropertySchema);
