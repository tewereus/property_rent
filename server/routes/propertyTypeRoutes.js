const express = require("express");
const router = express.Router();
const {
  createPropertyType,
  getAllPropertyTypes,
  getPropertyType,
  updatePropertyType,
  deletePropertyType,
} = require("../controllers/propertyTypeCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create-type", authMiddleware, createPropertyType);
router.get("/all-types", getAllPropertyTypes);
router.put("/edit-type", authMiddleware, updatePropertyType);
router.delete("/delete-type", authMiddleware, deletePropertyType);
router.get("/:id", getPropertyType);

module.exports = router;
