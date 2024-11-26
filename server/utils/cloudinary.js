const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("No file path provided");
    }

    // Upload the file to cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "property_images",
    });

    // Delete the temporary file after upload
    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    // Delete the temporary file in case of error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Error uploading to Cloudinary: ${error.message}`);
  }
};

module.exports = { uploadToCloudinary };
