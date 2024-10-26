const mongoose = require("mongoose");
var propertyCategory = new mongoose.Schema({
  num_bed: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("PropertyCategory", propertyCategory);
