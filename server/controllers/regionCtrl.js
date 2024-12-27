const Region = require("../models/regionModel");
const asyncHandler = require("express-async-handler");

const addRegion = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  try {
    const newRegion = await Region.create(req.body);
    res.json(newRegion);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllRegions = asyncHandler(async (req, res) => {
  try {
    const regions = await Region.find();
    res.json(regions);
  } catch (error) {
    throw new Error(error);
  }
});

const editRegion = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  const { addrId } = req.params;
  try {
    const region = await Region.findByIdAndUpdate(addrId, req.body, {
      new: true,
    });
    res.json(region);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteRegion = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  const { addrId } = req.params;
  try {
    const region = await Region.findByIdAndDelete(addrId);
    res.json(region);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAllRegions = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  try {
    const region = await Region.deleteMany();
    res.json(region);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addRegion,
  getAllRegions,
  editRegion,
  deleteRegion,
  deleteAllRegions,
};
