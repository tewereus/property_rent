const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateRefreshToken } = require("../config/refreshToken");
const { generateToken } = require("../config/jwtToken");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (user) throw new Error("user already exists");
    const newUser = await User.create({
      name,
      email,
      password,
    });
    res.json(newUser);
  } catch (error) {
    throw new Error(error);
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("user doesn't exists");
    if (user && password === user.password) {
      const refreshToken = generateRefreshToken(user._id);
      const updateduser = await User.findByIdAndUpdate(
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

const ToggleDarkMode = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { mode } = req.body.preference;
  try {
    const darkMode = await User.findByIdAndUpdate(
      id,
      {
        "preference.mode": mode,
      },
      {
        new: true,
      }
    ).select("preference.mode -_id");
    res.json(darkMode);
  } catch (error) {
    throw new Error(error);
  }
});

const verifySeller = asyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log("here");
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        seller_tab: "active",
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  register,
  login,
  ToggleDarkMode,
  verifySeller,
};
