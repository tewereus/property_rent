const asyncHandler = require("express-async-handler");
const {
  PropertyType,
  createPropertyTypeDiscriminator,
} = require("../models/propertyTypeModel");

const createPropertyType = asyncHandler(async (req, res) => {
  const { name, fields } = req.body;
  // const { id } = req.user;

  try {
    // Check if property type already exists
    const existingType = await PropertyType.findOne({ name });
    if (existingType) {
      return res.status(400).json({
        message: "Property type with this name already exists",
      });
    }

    // First create the base property type
    const propertyType = await PropertyType.create({
      name,
      fields,
    });

    // Create new discriminator
    const NewPropertyType = createPropertyTypeDiscriminator(name, fields);

    // Create instance of the new property type with default values
    const initialValues = fields.reduce((acc, field) => {
      // Set default values based on type
      let defaultValue;
      switch (field.type) {
        case "String":
          defaultValue = "";
          break;
        case "Number":
          defaultValue = 0;
          break;
        case "Boolean":
          defaultValue = false;
          break;
        case "Date":
          defaultValue = new Date();
          break;
        default:
          defaultValue = null;
      }
      return {
        ...acc,
        [field.name]: defaultValue,
      };
    }, {});

    // Update the property type with the discriminator
    const updatedPropertyType = await NewPropertyType.findByIdAndUpdate(
      propertyType._id,
      initialValues,
      { new: true }
    ).populate("createdBy", "firstname lastname");

    res.status(201).json(updatedPropertyType);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllPropertyTypes = asyncHandler(async (req, res) => {
  try {
    const propertyTypes = await PropertyType.find();
    res.json(propertyTypes);
  } catch (error) {
    throw new Error(error);
  }
});

const getPropertyType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const propertyType = await PropertyType.findById(id).populate(
      "firstname lastname"
    );
    if (!propertyType) {
      return res.status(404).json({
        message: "Property type not found",
      });
    }
    res.json(propertyType);
  } catch (error) {
    throw new Error(error);
  }
});

const updatePropertyType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, fields } = req.body;

  try {
    const propertyType = await PropertyType.findById(id);
    if (!propertyType) {
      return res.status(404).json({
        message: "Property type not found",
      });
    }

    // Create new discriminator with updated fields
    const UpdatedPropertyType = createPropertyTypeDiscriminator(
      name || propertyType.name,
      fields
    );
    const updatedType = await UpdatedPropertyType.findByIdAndUpdate(
      id,
      {
        name,
        ...fields.reduce(
          (acc, field) => ({
            ...acc,
            [field.name]: propertyType[field.name] || null,
          }),
          {}
        ),
      },
      { new: true }
    );

    res.json(updatedType);
  } catch (error) {
    throw new Error(error);
  }
});

const deletePropertyType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const propertyType = await PropertyType.findByIdAndDelete(id);
    if (!propertyType) {
      return res.status(404).json({
        message: "Property type not found",
      });
    }
    res.json({
      message: "Property type deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createPropertyType,
  getAllPropertyTypes,
  getPropertyType,
  updatePropertyType,
  deletePropertyType,
};
