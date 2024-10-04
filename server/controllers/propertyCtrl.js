const asyncHandler = require("express-async-handler");
const Property = require("../models/propertyModel");
const PropertyType = require("../models/propertyTypeModel");
const User = require("../models/userModel");

const createProperty = asyncHandler(async (req, res) => {
  const { id } = req.user;

  // use validatemongodbid to check if logged in is admin then create product type
  const {
    name,
    property_type,
    property_use,
    num_bed,
    location,
    price,
    description,
    images,
    status,
    // userId,
  } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    const propertyType = await PropertyType.findOne({ name: property_type });
    // console.log("type here ", propertyType._id);
    const property = await Property.create({
      // owner: userId,
      owner: id,
      name,
      property_type: propertyType._id,
      property_use,
      num_bed,
      location,
      price,
      description,
      images,
      status,
    });
    res.json(property);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProperty = asyncHandler(async (req, res) => {
  // const {id} = req.user
  const { propId } = req.body;
  try {
    const property = await Property.findByIdAndDelete(propId);
    res.json(property);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProperties = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const properties = await Property.find({ owner: { $ne: id } });
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllSellProperties = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const properties = await Property.find({
      owner: { $ne: id },
      property_use: "sell",
    });
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllRentProperties = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const properties = await Property.find({
      owner: { $ne: id },
      property_use: "rent",
    });
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUsersProperties = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const properties = await Property.find({ owner: id });
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

const editProperty = asyncHandler(async (req, res) => {
  // const {id} = req.user
  const { propId } = req.body;
  try {
    const property = await Property.findByIdAndUpdate(propId, req.body, {
      new: true,
    });
    res.json(property);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAllProperties = asyncHandler(async (req, res) => {
  try {
    const properties = await Property.deleteMany();
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAllUsersProperties = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const properties = await Property.deleteMany({ owner: id });
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProperty,
  deleteProperty,
  editProperty,
  getAllProperties,
  getAllSellProperties,
  getAllRentProperties,
  getAllUsersProperties,
  deleteAllProperties,
  deleteAllUsersProperties,
};
