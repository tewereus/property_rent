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
    const newUser = await User.create(req.body);
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
        wishlist: updateduser?.wishlist,
        seller_tab: updateduser?.seller_tab,
        mode: updateduser?.mode,
        token: accessToken,
      });
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.json(user);
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
  console.log("here at verify");
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

const getWishlist = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const wishlist = await User.findById(id)
      .select("wishlist")
      .populate({
        path: "wishlist",
        populate: [
          { path: "address.region address.subregion address.location" },
          { path: "owner", select: "phone" },
        ],
      });

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(id);
    console.log(user.wishlist);
    // if (user.wishlist === null) {
    //   let updateduser = await User.findByIdAndUpdate(
    //     id,
    //     {
    //       $push: { wishlist: prodId },
    //     },
    //     { new: true }
    //   );

    //   res.json(updateduser);
    // }
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      );

      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      );

      res.json(user);
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const changeMode = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { mode } = req.body;

  try {
    const changedMode = await User.findByIdAndUpdate(
      id,
      {
        mode: mode,
      },
      { new: true }
    );
    res.json(changedMode);
  } catch (error) {
    throw new Error(error);
  }
});

const changeLanguage = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { language } = req.body.preference;
  try {
    const lang = await User.findByIdAndUpdate(
      id,
      {
        "preference.language": language,
      },
      {
        new: true,
      }
    ).select("preference.language -_id");
    res.json(lang);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  register,
  login,
  updateUser,
  ToggleDarkMode,
  verifySeller,
  getWishlist,
  addToWishlist,
  changeMode,
  changeLanguage,
};
