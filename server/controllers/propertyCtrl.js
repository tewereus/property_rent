const asyncHandler = require("express-async-handler");
const {
  Property,
  createPropertyDiscriminator,
} = require("../models/propertyModel");
const { PropertyType } = require("../models/propertyTypeModel");
const Transaction = require("../models/transactionModel");
const formidable = require("formidable").formidable;
const { uploadToCloudinary } = require("../utils/cloudinary");

const createProperty = asyncHandler(async (req, res) => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit per file
  });

  try {
    const [fields, files] = await form.parse(req);
    const { id } = req.user;

    // Get property type and create discriminator
    const propertyType = await PropertyType.findById(fields.propertyType[0]);
    if (!propertyType) {
      return res.status(404).json({
        message: "Property type not found",
      });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    if (files.images) {
      // Handle both single and multiple files
      const imageFiles = Array.isArray(files.images)
        ? files.images
        : [files.images];

      for (const file of imageFiles) {
        try {
          const result = await uploadToCloudinary(file.filepath);
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          // Continue with other images if one fails
        }
      }
    }

    // Parse typeSpecificFields if it exists
    let typeSpecificFields = {};
    if (fields.typeSpecificFields && fields.typeSpecificFields[0]) {
      try {
        typeSpecificFields = JSON.parse(fields.typeSpecificFields[0]);
      } catch (error) {
        console.error("Error parsing typeSpecificFields:", error);
      }
    }

    // Create property instance with base fields
    const propertyData = {
      title: fields.title[0],
      description: fields.description[0],
      price: parseFloat(fields.price[0]),
      location: fields.location[0],
      propertyType: fields.propertyType[0],
      property_use: fields.property_use[0],
      images: imageUrls,
      owner: id,
      typeSpecificFields,
    };

    const property = new Property(propertyData);
    await property.save();

    // Populate references before sending response
    const populatedProperty = await Property.findById(property._id)
      .populate("propertyType")
      .populate("owner", "firstname lastname");

    res.status(201).json(populatedProperty);
  } catch (error) {
    console.error("Property creation error:", error);
    res.status(500).json({
      message: error.message || "Error creating property",
    });
  }
});

const getAllProperties = asyncHandler(async (req, res) => {
  // const { id } = req.user;
  try {
    console.log(req.query);
    const queryObj = { ...req.query };
    const excludeFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "role",
      "search",
      "searchField",
      "property_type",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (req.query.property_type) {
      const propertyType = await PropertyType.findOne({
        name: req.query.property_type,
      });

      if (propertyType) {
        queryObj.propertyType = propertyType._id;
      }
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Property.find(JSON.parse(queryStr));

    query = query
      .populate("propertyType")
      .populate("owner", "firstname lastname");

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const usersCount = await Property.countDocuments();
      if (skip >= usersCount) throw new Error("This Page does not exist");
    }
    const totalUsers = await Property.countDocuments();
    const properties = await query;
    res.json({ properties, totalUsers });
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
    const properties = await Property.find({ owner: id });
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

const buyProperty = asyncHandler(async (req, res) => {
  const { propertyId, paymentMethod } = req.body;
  const { id } = req.user;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (property.status !== "available") {
      return res.status(400).json({
        message: "Property is not available for purchase",
      });
    }

    if (property.owner.toString() === id) {
      return res.status(400).json({
        message: "You cannot buy your own property",
      });
    }
    console.log("first");
    // Create transaction
    const transaction = await Transaction.create({
      property: propertyId,
      buyer: id,
      seller: property.owner,
      amount: property.price,
      paymentMethod,
      transactionType: property.property_use === "rent" ? "rent" : "purchase",
      transactionDetails: {
        paymentDate: new Date(),
        receiptNumber: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      },
    });
    console.log("second");

    // Update property status
    property.status = property.property_use === "rent" ? "rented" : "sold";
    await property.save();
    console.log("third");

    // Populate the transaction with property and user details
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("property")
      .populate("buyer", "name email")
      .populate("seller", "name email");

    console.log("fourth");

    res.json({
      message: `Property ${
        property.property_use === "rent" ? "rental" : "purchase"
      } initiated successfully`,
      property,
      transaction: populatedTransaction,
    });
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
  buyProperty,
};
