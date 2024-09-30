const express = require("express");
const {
  createProperty,
  deleteProperty,
  editProperty,
} = require("../controllers/propertyCtrl");
const router = express.Router();

router.post("/create-property", createProperty);
router.delete("/delete-property", deleteProperty);
router.put("/edit-property", editProperty);

module.exports = router;
