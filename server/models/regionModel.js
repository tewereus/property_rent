const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema(
  {
    region_name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Region", regionSchema);
