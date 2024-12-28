const mongoose = require("mongoose");

const subRegionSchema = new mongoose.Schema(
  {
    subregion_name: {
      type: String,
      required: true,
    },
    region_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SubRegion", subRegionSchema);
