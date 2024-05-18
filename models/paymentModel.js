const mongoose = require("mongoose");

// Define the schema
const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userProfile",
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RestaurantDetails",
  },
  amount: {
    type: Number,
    required: true,
  },
  mode: {
    type: String,

    required: true,
  },
  //  status: {
  //     type: String,

  //     required: true,
  //   },
  date: {
    type: Date,
    default: Date.now,
  },
  discount: {
    type: Number,
    default: 0,
  },
});

// Create the model
const Payment = mongoose.model("Payment", paymentSchema);

// Export the model
module.exports = Payment;
