const express = require("express");
const {
  addLocation,
  getAllLocations,
  editLocation,
  deleteLocation,
  deleteAllLocations,
} = require("../controllers/locationCtrl");
// const { adminAuthMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-location", addLocation);
router.get("/all-locations", getAllLocations);
router.put("/edit-location/:addrId", editLocation);
router.delete("/delete/:addrId", deleteLocation);
router.delete("/delete-all", deleteAllLocations);

module.exports = router;
