const express = require("express");
const router = express.Router();

// Load Controllers
const {
  registerController2,
  activationController,
  signInController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/auth.controller");

router.post("/register", registerController2);

router.post("/login", signInController);

router.post("/activation", activationController);

// forgot reset password
router.put("/forgotpassword", forgotPasswordController); ////not used for now ############################################## todo
router.put("/resetpassword", resetPasswordController); ////not used for now ############################################## todo

module.exports = router;
