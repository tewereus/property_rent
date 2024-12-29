const express = require("express");
const {
  register,
  login,
  ToggleDarkMode,
  verifySeller,
  addToWishlist,
  getWishlist,
  changeMode,
  changeLanguage,
  updateUser,
} = require("../controllers/authCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update-user", authMiddleware, updateUser);
router.put("/dark-mode", authMiddleware, ToggleDarkMode);
router.put("/verify-seller", authMiddleware, verifySeller);
router.put("/add-wishlist", authMiddleware, addToWishlist);
router.get("/all-wishlists", authMiddleware, getWishlist);
router.put("/change-mode", authMiddleware, changeMode);
router.put("/change-language", authMiddleware, changeLanguage);

module.exports = router;
