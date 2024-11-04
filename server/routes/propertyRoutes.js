const express = require("express");
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getUserProperties,
  getPropertiesByType,
  getPropertiesByUse,
} = require("../controllers/propertyCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
// const { uploadImages } = require("../middlewares/uploadImages");

// Public routes
router.get("/", getAllProperties);
router.get("/type/:typeId", getPropertiesByType);
router.get("/use/:use", getPropertiesByUse);
router.get("/:id", getProperty);

// Protected routes
router.use(authMiddleware);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);
router.get("/user/properties", getUserProperties);

module.exports = router;
