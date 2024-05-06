const express = require("express");
const router = express.Router();
const {
  createPaymentOption,
  getPaymentOptionsId,
  updatePaymentOptionsById,
} = require("../controllers/paymentOption");

// Route to create a payment option and link it to restaurant details
router.post("/paymentoptions/:restaurantDetailsId",createPaymentOption);
router.get(
  "/paymentoptions/:restaurantDetailsId",
  getPaymentOptionsId
);

// Route to update payment options by restaurant details ID
router.put("/paymentoptions/:restaurantDetailsId",updatePaymentOptionsById);


module.exports = router;
