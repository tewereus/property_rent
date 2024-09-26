const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  try {
    console.log(`mongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`mongodb connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
