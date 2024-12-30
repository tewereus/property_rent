const mongoose = require("mongoose");
var propertyCategory = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    // capitalize: true,
  },
});

module.exports = mongoose.model("PropertyCategory", propertyCategory);
