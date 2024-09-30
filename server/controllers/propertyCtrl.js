const asyncHandler = require("express-async-handler");
const Property = require("../models/propertyModel");

const createProperty = asyncHandler(async (req, res) => {
  // const {id} = req.user
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
  } = req.body;
  try {
    const property = await Property.create({
      name,
      property_type,
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

module.exports = {
  createProperty,
  deleteProperty,
  editProperty,
};
