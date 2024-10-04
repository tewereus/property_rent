const express = require("express");
const {
  register,
  login,
  ToggleDarkMode,
  verifySeller,
  addToWishlist,
  getWishlist,
} = require("../controllers/authCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/dark-mode", authMiddleware, ToggleDarkMode);
router.put("/verify-seller", authMiddleware, verifySeller);
router.put("/add-wishlist", authMiddleware, addToWishlist);
router.get("/all-wishlists", authMiddleware, getWishlist);

module.exports = router;
