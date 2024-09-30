const express = require("express");
const { register, login } = require("../controllers/adminCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
