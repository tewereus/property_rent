const express = require("express");
const {
  addSubRegion,
  getAllSubRegions,
  editSubRegion,
  deleteSubRegion,
  deleteAllSubRegions,
} = require("../controllers/subRegionCtrl");
// const { adminAuthMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-subregion", addSubRegion);
router.get("/all-subregions", getAllSubRegions);
router.put("/edit-subregion/:addrId", editSubRegion);
router.delete("/delete/:addrId", deleteSubRegion);
router.delete("/delete-all", deleteAllSubRegions);

module.exports = router;
