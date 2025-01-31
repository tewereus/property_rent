const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Region",
        required: true,
      },
      subregion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubRegion",
        required: true,
      },
      location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
      },
    },
    propertyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyType",
      required: true,
    },
    propertyCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyCategory",
      // required: true,
    },
    property_use: {
      type: String,
      enum: ["sell", "rent"],
      required: true,
    },
    images: [
      {
        type: String, // URLs of images
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented", "pending", "rejected"],
      default: "available",
    },
    views: {
      user: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      count: {
        type: Number,
        default: 0,
      },
    },
    is_rejected: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    transactionHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    // Dynamic fields based on property type
    typeSpecificFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    discriminatorKey: "__type",
  }
);

// Middleware to validate type-specific fields before saving
propertySchema.pre("save", async function (next) {
  try {
    const propertyType = await mongoose
      .model("PropertyType")
      .findById(this.propertyType);
    if (!propertyType) {
      throw new Error("Property type not found");
    }

    // Validate required fields
    if (propertyType.kind) {
      const typeModel = await mongoose.model(propertyType.kind);
      const typeSchema = typeModel.schema;

      for (const [fieldName, fieldSchema] of Object.entries(typeSchema.paths)) {
        if (
          fieldSchema.options.required &&
          !this.typeSpecificFields.get(fieldName)
        ) {
          throw new Error(`${fieldName} is required for ${propertyType.name}`);
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Method to set type-specific fields
propertySchema.methods.setTypeFields = function (fields) {
  Object.entries(fields).forEach(([key, value]) => {
    this.typeSpecificFields.set(key, value);
  });
};

const Property = mongoose.model("Property", propertySchema);

// Create property discriminator dynamically
const createPropertyDiscriminator = (propertyType) => {
  const schemaFields = {};

  propertyType.fields?.forEach((field) => {
    // Map string types to actual Mongoose types
    let fieldType;
    switch (field.type) {
      case "String":
        fieldType = String;
        break;
      case "Number":
        fieldType = Number;
        break;
      case "Boolean":
        fieldType = Boolean;
        break;
      case "Date":
        fieldType = Date;
        break;
      default:
        throw new Error(`Invalid field type: ${field.type}`);
    }

    schemaFields[field.name] = {
      type: fieldType,
      required: field.required,
    };
  });

  const newSchema = new mongoose.Schema(schemaFields);
  return Property.discriminator(propertyType.name, newSchema);
};

module.exports = {
  Property,
  createPropertyDiscriminator,
};
