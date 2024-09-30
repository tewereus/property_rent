const asyncHandler = require("express-async-handler");
const Manager = require("../models/managerModel");

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
  try {
    const manager = await Manager.findOne({ email });
    if (!manager) throw new Error("manager doesn't exists");
    if (manager && password === manager.password) {
      res.json({
        message: "logged in successfully",
        _id: manager?._id,
        name: manager?.name,
        email: manager?.email,
      });
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  register,
  login,
};
