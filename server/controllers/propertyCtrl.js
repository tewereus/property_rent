const asyncHandler = require("express-async-handler");
const {
  Property,
  createPropertyDiscriminator,
} = require("../models/propertyModel");
const { PropertyType } = require("../models/propertyTypeModel");

const createProperty = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { typeSpecificFields, ...propertyData } = req.body;

  try {
    // Get property type and create discriminator
    const propertyType = await PropertyType.findById(propertyData.propertyType);
    if (!propertyType) {
      return res.status(404).json({
        message: "Property type not found",
      });
    }

    // Create property instance with base fields
    const property = new Property({
      ...propertyData,
      owner: id,
    });

    // Set type-specific fields using the Map
    if (typeSpecificFields) {
      Object.entries(typeSpecificFields).forEach(([key, value]) => {
        property.typeSpecificFields.set(key, value);
      });
    }

    await property.save();

    // Populate references before sending response
    const populatedProperty = await Property.findById(property._id)
      .populate("propertyType")
      .populate("owner", "firstname lastname");

    res.status(201).json(populatedProperty);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProperties = asyncHandler(async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("propertyType")
      .populate("owner", "firstname lastname");
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

const getProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id)
      .populate("propertyType")
      .populate("owner", "firstname lastname");

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }
    res.json(property);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { typeSpecificFields, ...updateData } = req.body;

  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // Update basic fields
    Object.assign(property, updateData);

    // Update type-specific fields
    if (typeSpecificFields) {
      property.setTypeFields(typeSpecificFields);
    }

    await property.save();
    res.json(property);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }
    res.json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getUserProperties = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const properties = await Property.find({ owner: id })
      .populate("propertyType")
      .populate("owner", "firstname lastname");
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

const getPropertiesByType = asyncHandler(async (req, res) => {
  const { typeId } = req.params;
  try {
    const properties = await Property.find({ propertyType: typeId })
      .populate("propertyType")
      .populate("owner", "firstname lastname");
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

const getPropertiesByUse = asyncHandler(async (req, res) => {
  const { use } = req.params; // 'sell' or 'rent'
  try {
    const properties = await Property.find({ property_use: use })
      .populate("propertyType")
      .populate("owner", "firstname lastname");
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProperty,
  getAllProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getUserProperties,
  getPropertiesByType,
  getPropertiesByUse,
};
