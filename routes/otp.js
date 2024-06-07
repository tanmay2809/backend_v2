// routes/otpRoutes.js
const express = require("express");
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  checkEmailExistence,
} = require("../controllers/otp");

// Route for sending OTP
router.post("/send-otp", sendOtp);

// Route for verifying OTP
router.post("/verify-otp", verifyOtp);

// Route for checking email existence
router.post("/check-email-existence", checkEmailExistence);

module.exports = router;
