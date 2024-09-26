const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

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
      res.json(user);
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
