const express = require("express");
const router = express.Router();

// import controller
const { userBookingMiddleware } = require("../middlewares/booking.middleware");
const { userResourseMiddleware } = require("../middlewares/user.middleware");
const {
  readController,
  updateController,
  updateNonPasswordController,
  bookController,
  cancelController,
  getUserTransactions,
  signOut,
  addVehicle,
} = require("../controllers/user.controller");
const {
  bookingValidatorMiddleware,
  cancellingValidatorMiddleware,
} = require("../validators/booking.validator");

router.post("/user/addVehicle", userResourseMiddleware, addVehicle);
router.get("/user/transactions", userResourseMiddleware, getUserTransactions);
router.get("/user", userResourseMiddleware, readController);
router.post("/user/signOut", userResourseMiddleware, signOut);
router.put("/user/update", userResourseMiddleware, updateController);
router.put(
  "/user/nonPasswordUpdate",
  userResourseMiddleware,
  updateNonPasswordController
);
router.post(
  "/user/book",
  bookingValidatorMiddleware,
  userResourseMiddleware,
  userBookingMiddleware,
  bookController
);
router.post("/user/cancel", userResourseMiddleware, cancelController);

module.exports = router;
