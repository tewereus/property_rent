const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract the token from the authorization header
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Retrieve the user based on the decoded token
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
          req.user = user;
          next(); // Continue to the next middleware or route handler
        } else {
          throw new Error("User not found with the provided token");
        }
      } else {
        throw new Error("No token provided in the authorization header");
      }
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  } else {
    throw new Error("Authorization header with Bearer token is required");
  }
});

module.exports = {
  authMiddleware,
};
