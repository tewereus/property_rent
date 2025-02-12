const asyncHandler = require("express-async-handler");
const Manager = require("../models/managerModel");
const User = require("../models/userModel");
const { generateRefreshToken } = require("../config/refreshToken");
const { generateToken } = require("../config/jwtToken");
const { Property } = require("../models/propertyModel");
const Transaction = require("../models/transactionModel");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const manager = await Manager.findOne({ email });
    if (manager) throw new Error("manager already exists");
    const newManager = await Manager.create({
      name,
      email,
      password,
    });
    res.json(newManager);
  } catch (error) {
    throw new Error(error);
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const manager = await Manager.findOne({ email });
    console.log(manager);
    if (!manager) throw new Error("manager doesn't exists");
    if (manager && password == manager.password) {
      const refreshToken = generateRefreshToken(manager._id);
      const updateduser = await Manager.findByIdAndUpdate(
        manager._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 3 days
      });

      const accessToken = generateToken(manager._id);

      res.json({
        message: "logged in successfully",
        _id: manager?._id,
        name: manager?.name,
        email: manager?.email,
        token: accessToken,
      });
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    const totalUsers = users.length;

    const activeUsers = users.filter((prop) => prop.status === "active").length;

    const blockedUsers = users.filter(
      (prop) => prop.status === "blocked"
    ).length;

    res.json({
      users,
      totalUsers,
      activeUsers,
      blockedUsers,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const editUser = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  const { addrId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(addrId, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const getRegionProperties = asyncHandler(async (req, res) => {
  const { id } = req.manager;
  try {
    const manager = await Manager.findById(id);
    // const properties = await Property.find({ owner: id });
    const properties = await Property.find({ region: manager.region_id })
      .populate("propertyType")
      .populate({
        path: "address.region",
        select: "region region_name",
      })
      .populate({
        path: "address.subregion",
        select: "subregion subregion_name",
      })
      .populate({
        path: "address.location",
        select: "location",
      });

    const totalProperties = properties.length;
    const saleProperties = properties.filter(
      (prop) => prop.property_use === "sell"
    ).length;

    const rentProperties = properties.filter(
      (prop) => prop.property_use === "rent"
    ).length;

    res.json({
      properties,
      totalProperties,
      saleProperties,
      rentProperties,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getSaleTransaction = asyncHandler(async (req, res) => {
  // const {id} = req.manager
  try {
    const transaction = await Transaction.find({ transactionType: "sell" });
    res.json(transaction);
  } catch (error) {
    throw new Error(error);
  }
});

const getRentTransaction = asyncHandler(async (req, res) => {
  try {
    const transaction = await Transaction.find({ transactionType: "rent" });
    res.json(transaction);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  register,
  login,
  getAllUsers,
  editUser,
  getRegionProperties,
  getSaleTransaction,
  getRentTransaction,
};
