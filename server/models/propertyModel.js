const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  property_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PropertyType",
    required: true,
  },
  property_use: {
    type: String,
    enum: ["sell", "rent"],
    required: true,
  },
  num_bed: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: String,
  },
  status: {
    type: String,
    enum: ["available", "unavailable", "sold"],
    default: "available",
  },
});

//Export the model
module.exports = mongoose.model("Property", propertySchema);
