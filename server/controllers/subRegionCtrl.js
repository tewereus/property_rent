const SubRegion = require("../models/SubRegionModel");
const asyncHandler = require("express-async-handler");

// Add SubRegion
const addSubRegion = asyncHandler(async (req, res) => {
  try {
    const newSubRegion = await SubRegion.create(req.body);
    res.json(newSubRegion);
  } catch (error) {
    throw new Error(error);
  }
});

// Get All SubRegions
const getAllSubRegions = asyncHandler(async (req, res) => {
  try {
    const subRegions = await SubRegion.find().populate("region_id");
    res.json(subRegions);
  } catch (error) {
    throw new Error(error);
  }
});

// Edit SubRegion
const editSubRegion = asyncHandler(async (req, res) => {
  const { addrId } = req.params;
  validateMongoDbId(addrId);
  try {
    const updatedSubRegion = await SubRegion.findByIdAndUpdate(
      addrId,
      req.body,
      { new: true }
    );
    res.json(updatedSubRegion);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete SubRegion
const deleteSubRegion = asyncHandler(async (req, res) => {
  const { addrId } = req.params;
  validateMongoDbId(addrId);
  try {
    const deletedSubRegion = await SubRegion.findByIdAndDelete(addrId);
    res.json(deletedSubRegion);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete All SubRegions
const deleteAllSubRegions = asyncHandler(async (req, res) => {
  try {
    await SubRegion.deleteMany({});
    res.json({ message: "All subregions have been deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addSubRegion,
  getAllSubRegions,
  editSubRegion,
  deleteSubRegion,
  deleteAllSubRegions,
};
