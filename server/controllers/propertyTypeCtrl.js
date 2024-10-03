const asyncHandler = require("express-async-handler");
const PropertyType = require("../models/propertyTypeModel");

const createPropertyType = asyncHandler(async (req, res) => {
  // const {id} = req.admin
  // use validatemongodbid to check if logged in is admin then create product type
  const { name } = req.body;
  try {
    const property = await PropertyType.create({
      name: name,
    });
    res.json(property);
  } catch (error) {
    throw new Error(error);
  }
});

const deletePropertyType = asyncHandler(async (req, res) => {
  // const {id} = req.admin
  const { propId } = req.body;
  try {
    const property = await PropertyType.findByIdAndDelete(propId);
    res.json(property);
  } catch (error) {
    throw new Error(error);
  }
});

const editPropertyType = asyncHandler(async (req, res) => {
  // const {id} = req.admin
  const { propId } = req.body;
  try {
    const property = await PropertyType.findByIdAndUpdate(propId, req.body, {
      new: true,
    });
    res.json(property);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllPropertyTypes = asyncHandler(async (req, res) => {
  try {
    const allProperties = await PropertyType.find();
    const property = allProperties.map((prop) => prop.name);
    // console.log(property);
    res.json(property);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createPropertyType,
  deletePropertyType,
  editPropertyType,
  getAllPropertyTypes,
};
