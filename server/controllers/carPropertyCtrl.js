const asyncHandler = require("express-async-handler");
const CarProperty = require("../models/carPropertyModel");
const User = require("../models/userModel");

// Create a new car property
const createCarProperty = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const {
    make,
    model,
    year,
    price,
    mileage,
    fuel_type,
    transmission,
    color,
    description,
    images,
    status,
  } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    const carProperty = await CarProperty.create({
      owner: id,
      make,
      model,
      year,
      price,
      mileage,
      fuel_type,
      transmission,
      color,
      description,
      images,
      status,
    });

    res.json(carProperty);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all car properties
const getAllCarProperties = asyncHandler(async (req, res) => {
  try {
    const carProperties = await CarProperty.find();
    res.json(carProperties);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single car property by ID
const getCarPropertyById = asyncHandler(async (req, res) => {
  const { carId } = req.params;
  try {
    const carProperty = await CarProperty.findById(carId);
    if (!carProperty) throw new Error("Car property not found");
    res.json(carProperty);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a car property
const updateCarProperty = asyncHandler(async (req, res) => {
  const { carId } = req.params;
  try {
    const carProperty = await CarProperty.findByIdAndUpdate(carId, req.body, {
      new: true,
    });
    if (!carProperty) throw new Error("Car property not found");
    res.json(carProperty);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a car property
const deleteCarProperty = asyncHandler(async (req, res) => {
  const { carId } = req.params;
  try {
    const carProperty = await CarProperty.findByIdAndDelete(carId);
    if (!carProperty) throw new Error("Car property not found");
    res.json({ message: "Car property deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCarProperty,
  getAllCarProperties,
  getCarPropertyById,
  updateCarProperty,
  deleteCarProperty,
};
