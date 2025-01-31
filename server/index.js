const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/adminRoutes");
const managerRouter = require("./routes/managerRoutes");
const propertyTypeRouter = require("./routes/propertyTypeRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const propertyRouter = require("./routes/propertyRoutes");
const transactionRouter = require("./routes/transactionRoutes");
const locationRouter = require("./routes/locationRoutes");
const regionRouter = require("./routes/regionRoutes");
const subRegionRouter = require("./routes/subRegionRoutes");
const paymentRouter = require("./routes/paymentRoute");
const PORT = process.env.PORT || 9001;
// const { Property } = require("./models/propertyModel");
// const User = require("./models/userModel");

connectDB();
app.use(morgan("dev"));
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:8081",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/manager", managerRouter);
app.use("/api/v1/property", propertyRouter);
app.use("/api/v1/property-type", propertyTypeRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/region", regionRouter);
app.use("/api/v1/subregion", subRegionRouter);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/payment", paymentRouter);

// const updateUsers = async () => {
//   try {
//     // Update all users to add the new properties field
//     await Property.updateMany({}, { $set: { is_rejected: "" } }); // Initialize properties as an empty array

//     console.log("All users have been updated successfully.");
//   } catch (error) {
//     console.error("Error updating users:", error);
//   }
// };
// updateUsers();

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, (req, res) => {
  console.log(`server running on port ${PORT}`);
});
