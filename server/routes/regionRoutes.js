const express = require("express");
const {
  addRegion,
  getAllRegions,
  editRegion,
  deleteRegion,
  deleteAllRegions,
} = require("../../controllers/address/regionCtrl");
const { adminAuthMiddleware } = require("../../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-region", adminAuthMiddleware, addRegion);
router.get("/all-regions", getAllRegions);
router.put("/edit-region/:addrId", adminAuthMiddleware, editRegion);
router.delete("/delete/:addrId", adminAuthMiddleware, deleteRegion);
router.delete("/delete-all", adminAuthMiddleware, deleteAllRegions);

module.exports = router;
