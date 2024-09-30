const express = require("express");
const {
  createPropertyType,
  deletePropertyType,
  editPropertyType,
} = require("../controllers/propertyTypeCtrl");
const router = express.Router();

router.post("/create-type", createPropertyType);
router.delete("/delete-type", deletePropertyType);
router.put("/edit-type", editPropertyType);

module.exports = router;
