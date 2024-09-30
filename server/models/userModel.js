const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("User", userSchema);
