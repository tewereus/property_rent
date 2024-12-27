const express = require("express");
const {
  addLocation,
  getAllLocations,
  editLocation,
  deleteLocation,
  deleteAllLocations,
} = require("../../controllers/address/locationCtrl");
const { adminAuthMiddleware } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-location", adminAuthMiddleware, addLocation);
router.get("/all-locations", getAllLocations);
router.put("/edit-location/:addrId", adminAuthMiddleware, editLocation);
router.delete("/delete/:addrId", adminAuthMiddleware, deleteLocation);
router.delete("/delete-all", adminAuthMiddleware, deleteAllLocations);

module.exports = router;
