const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  initializePayment,
  verifyPayment,
} = require("../controllers/paymentCtrl");

router.post("/initialize", authMiddleware, initializePayment);
router.get("/verify/:reference", verifyPayment);

module.exports = router;
