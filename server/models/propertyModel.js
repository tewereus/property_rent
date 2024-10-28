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
    location: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      enum: ["villa", "warehouse", "car", "apartment", "hall"],
      // required: true,
      default: "villa",
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
      enum: ["available", "sold", "rented"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);

const Villa = Property.discriminator(
  "Villa",
  new mongoose.Schema({
    gardenSize: { type: Number },
  })
);

const Warehouse = Property.discriminator(
  "Warehouse",
  new mongoose.Schema({
    storageCapacity: { type: Number },
  })
);

const Car = Property.discriminator(
  "Car",
  new mongoose.Schema({
    makeModel: { type: String },
  })
);

const Apartment = Property.discriminator(
  "Apartment",
  new mongoose.Schema({
    numberOfRooms: { type: Number },
  })
);

const Hall = Property.discriminator(
  "Hall",
  new mongoose.Schema({
    capacity: { type: Number },
  })
);

module.exports = { Property, Villa, Warehouse, Car, Apartment, Hall };
