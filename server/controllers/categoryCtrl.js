const Category = require("../models/propertyCategory");
const asyncHandler = require("express-async-handler");

const addCategory = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    throw new Error(error);
  }
});

const editCategory = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  const { catId } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(catId, req.body, {
      new: true,
    });
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  const { catId } = req.params;
  try {
    const category = await Category.findByIdAndDelete(catId);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAllCategories = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  try {
    const category = await Category.deleteMany();
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addCategory,
  getAllCategories,
  editCategory,
  deleteCategory,
  deleteAllCategories,
};
