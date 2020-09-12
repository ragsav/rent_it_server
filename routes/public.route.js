const express = require("express");
const router = express.Router();

// import controller
const {
  getCityController,
  getAreaController,
  getLotController,
  getSearchResult,
  getLotById,
  getLotWithoutImagesController,
} = require("../controllers/public.controller");
router.get("/search/:city_id/:text", getSearchResult);
router.get("/city", getCityController);
router.get("/city/:city_id", getAreaController);
router.get("/city/:city_id/:area_id", getLotController);
router.get("/city/:city_id/:area_id/:lot_id", getLotById);
router.get("/city_cached/:city_id/:area_id", getLotWithoutImagesController);
// router.get("/city/:city/:area/:lot", makeAreaController);

module.exports = router;
