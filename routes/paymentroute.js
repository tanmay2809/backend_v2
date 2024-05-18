const express = require("express");
const router = express.Router();
const {
  capturePaymentForRestaurant,
  verifyPaymentForRestaurant,
  getPaymentsByRestaurant,
} = require("../controllers/paymentController"); // Adjust the path as necessary

// Route to capture payment for a restaurant
router.post("/payment/capturepayment", capturePaymentForRestaurant);

// Route to verify payment for a restaurant
router.post("/payment/verifypayment", verifyPaymentForRestaurant);

// Route to get payments for a specific restaurant by ID
router.get("/payments/:resid", getPaymentsByRestaurant);

module.exports = router;
