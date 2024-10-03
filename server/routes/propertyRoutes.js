const express = require("express");
const {
  createProperty,
  deleteProperty,
  editProperty,
  deleteAllProperties,
  getAllUsersProperties,
  deleteAllUsersProperties,
} = require("../controllers/propertyCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create-property", authMiddleware, createProperty);
router.delete("/delete-property", deleteProperty);
router.put("/edit-property", editProperty);
router.delete("/delete-all", deleteAllProperties);
router.get("/users-properties", authMiddleware, getAllUsersProperties);
router.delete(
  "/delete-users-properties",
  authMiddleware,
  deleteAllUsersProperties
);

module.exports = router;
