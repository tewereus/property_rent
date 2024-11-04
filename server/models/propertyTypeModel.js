const mongoose = require("mongoose");

// Define field definition as a plain object type, not a schema
const fieldDefinition = {
  name: String,
  type: {
    type: String,
    enum: ["String", "Number", "Boolean", "Date"],
  },
  required: {
    type: Boolean,
    default: false,
  },
};

const basePropertyTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Use type: Array and specify the field structure
    fields: {
      type: [
        {
          name: String,
          type: {
            type: String,
            enum: ["String", "Number", "Boolean", "Date"],
          },
          required: {
            type: Boolean,
            default: false,
          },
        },
      ],
      required: true,
      _id: false, // This prevents MongoDB from creating _id for array elements
    },
  },
  {
    discriminatorKey: "kind",
    timestamps: true,
  }
);

const PropertyType = mongoose.model("PropertyType", basePropertyTypeSchema);

// Function to create a new discriminator dynamically
const createPropertyTypeDiscriminator = (typeName, fields) => {
  const schemaFields = {};

  fields.forEach((field) => {
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
  return PropertyType.discriminator(typeName, newSchema);
};

module.exports = {
  PropertyType,
  createPropertyTypeDiscriminator,
  fieldDefinition,
};
