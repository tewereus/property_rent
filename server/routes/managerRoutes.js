const express = require("express");
const {
  register,
  login,
  getAllUsers,
  editUser,
  getRegionProperties,
} = require("../controllers/managerCtrl");
const {
  authMiddleware,
  ManagerMiddleware,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/all-users", getAllUsers);
router.put("/edit-users/:id", editUser);
router.get("/region-properties", ManagerMiddleware, getRegionProperties);

module.exports = router;
