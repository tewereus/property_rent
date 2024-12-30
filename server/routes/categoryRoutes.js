const express = require("express");
const {
  addCategory,
  getAllCategories,
  editCategory,
  deleteCategory,
  deleteAllCategories,
} = require("../controllers/categoryCtrl");
// const { adminAuthMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-category", addCategory);
router.get("/all-categories", getAllCategories);
router.put("/edit-category/:catId", editCategory);
router.delete("/delete/:catId", deleteCategory);
router.delete("/delete-all", deleteAllCategories);

module.exports = router;
