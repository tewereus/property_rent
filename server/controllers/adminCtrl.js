const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const { generateRefreshToken } = require("../config/refreshToken");
const { generateToken } = require("../config/jwtToken");

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
    const user = await Admin.findOne({ email });
    console.log(user);
    if (!user) throw new Error("user doesn't exists");
    if (user && (await user.isPasswordMatched(password))) {
      const refreshToken = generateRefreshToken(user._id);
      const updateduser = await Admin.findByIdAndUpdate(
        user._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 3 days
      });

      const accessToken = generateToken(user._id);

      res.json({
        message: "logged in successfully",
        _id: updateduser?._id,
        name: updateduser?.name,
        email: updateduser?.email,
        preference: updateduser?.preference,
        seller_tab: updateduser?.seller_tab,
        token: accessToken,
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
