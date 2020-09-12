const express = require("express");
const router = express.Router();

// import controller
const {
  makeCityController,
  makeLotController,
  makePlotController,
  makeAreaController,
  modifyPlots,
} = require("../controllers/admin.controller");

router.post("/city", makeCityController);
router.post("/lot", makeLotController);
router.post("/plot", makePlotController);
router.post("/area", makeAreaController);
router.post("/plotUpdate", modifyPlots);

module.exports = router;
