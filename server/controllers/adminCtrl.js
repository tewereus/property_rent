const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin) throw new Error("admin already exists");
    const newAdmin = await Admin.create({
      name,
      email,
      password,
    });
    res.json(newAdmin);
  } catch (error) {
    throw new Error(error);
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) throw new Error("admin doesn't exists");
    if (admin && password === admin.password) {
      res.json({
        message: "logged in successfully",
        _id: admin?._id,
        name: admin?.name,
        email: admin?.email,
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
