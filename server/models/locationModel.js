const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var locationSchema = new mongoose.Schema(
  {
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },
    subregion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubRegion",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Location", locationSchema);
