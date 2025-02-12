const express = require("express");
const {
  register,
  login,
  getAllUsers,
  deleteUser,
  getAllManagers,
  deleteManager,
  addManager,
} = require("../controllers/adminCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/all-users", getAllUsers);
router.delete("/delete-user/:id", deleteUser);
router.get("/all-managers", getAllManagers);
router.delete("/delete-manager/:id", deleteManager);
router.post("/add-manager", addManager);

module.exports = router;
