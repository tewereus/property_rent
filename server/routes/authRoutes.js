const express = require("express");
const {
  register,
  login,
  ToggleDarkMode,
  verifySeller,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/dark-mode", authMiddleware, ToggleDarkMode);
router.put("/verify-seller", authMiddleware, verifySeller);

module.exports = router;
