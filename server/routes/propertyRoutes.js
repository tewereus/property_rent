const express = require("express");
const {
  createProperty,
  deleteProperty,
  editProperty,
  deleteAllProperties,
  getAllUsersProperties,
  deleteAllUsersProperties,
  getAllProperties,
  getAllSellProperties,
  getAllRentProperties,
} = require("../controllers/propertyCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create-property", authMiddleware, createProperty);
router.delete("/delete-property", deleteProperty);
router.put("/edit-property", editProperty);
router.delete("/delete-all", deleteAllProperties);
router.get("/all-properties", authMiddleware, getAllProperties);
router.get("/all-sell-properties", authMiddleware, getAllSellProperties);
router.get("/all-rent-properties", authMiddleware, getAllRentProperties);
router.get("/users-properties", authMiddleware, getAllUsersProperties);
router.delete(
  "/delete-users-properties",
  authMiddleware,
  deleteAllUsersProperties
);

module.exports = router;
