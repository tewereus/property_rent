const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "customer",
    },
    seller_tab: {
      type: String,
      default: "inactive",
    },

    mode: {
      type: String,
      enum: ["customer", "seller"],
      default: "customer",
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    preference: {
      mode: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      language: {
        type: String,
        enum: ["Eng", "Amh"],
        default: "Eng",
      },
    },
    refershToken: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
