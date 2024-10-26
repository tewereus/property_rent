const express = require("express");
const {
  createCarProperty,
  getAllCarProperties,
  getCarPropertyById,
  updateCarProperty,
  deleteCarProperty,
} = require("../controllers/carPropertyCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create-car", authMiddleware, createCarProperty);
router.get("/all-cars", getAllCarProperties);
router.get("/:carId", getCarPropertyById);
router.put("/:carId", authMiddleware, updateCarProperty);
router.delete("/:carId", authMiddleware, deleteCarProperty);

module.exports = router;
