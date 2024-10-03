const express = require("express");
const {
  createPropertyType,
  deletePropertyType,
  editPropertyType,
  getAllPropertyTypes,
} = require("../controllers/propertyTypeCtrl");
const router = express.Router();

router.post("/create-type", createPropertyType);
router.delete("/delete-type", deletePropertyType);
router.put("/edit-type", editPropertyType);
router.get("/all-types", getAllPropertyTypes);

module.exports = router;
