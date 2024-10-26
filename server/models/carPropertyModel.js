const mongoose = require("mongoose");

var carCategorySchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CarCategory", carCategorySchema);
