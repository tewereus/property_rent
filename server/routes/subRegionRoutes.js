const express = require("express");
const {
  addSubRegion,
  getAllSubRegions,
  editSubRegion,
  deleteSubRegion,
  deleteAllSubRegions,
} = require("../../controllers/address/subRegionCtrl");
const { adminAuthMiddleware } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-subregion", adminAuthMiddleware, addSubRegion);
router.get("/all-subregions", getAllSubRegions);
router.put("/edit-subregion/:addrId", adminAuthMiddleware, editSubRegion);
router.delete("/delete/:addrId", adminAuthMiddleware, deleteSubRegion);
router.delete("/delete-all", adminAuthMiddleware, deleteAllSubRegions);

module.exports = router;
