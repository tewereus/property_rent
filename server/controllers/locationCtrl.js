const Location = require("../models/locationModel");
const asyncHandler = require("express-async-handler");

const addLocation = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  try {
    const newLocation = await Location.create(req.body);
    res.json(newLocation);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllLocations = asyncHandler(async (req, res) => {
  try {
    const location = await Location.find()
      .populate("region_id", "region_name")
      .populate("subregion_id", "subregion_name");
    res.json(location);
  } catch (error) {
    throw new Error(error);
  }
});

const editLocation = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  const { addrId } = req.params;
  try {
    const location = await Location.findByIdAndUpdate(addrId, req.body, {
      new: true,
    });
    res.json(location);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteLocation = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  const { addrId } = req.params;
  try {
    const location = await Location.findByIdAndDelete(addrId);
    res.json(location);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAllLocations = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  try {
    const location = await Location.deleteMany();
    res.json(location);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addLocation,
  getAllLocations,
  editLocation,
  deleteLocation,
  deleteAllLocations,
};
