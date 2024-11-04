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

router.post("/", authMiddleware, createPropertyType);
router.get("/", getAllPropertyTypes);
router.get("/:id", getPropertyType);
router.put("/:id", authMiddleware, updatePropertyType);
router.delete("/:id", authMiddleware, deletePropertyType);

module.exports = router;
