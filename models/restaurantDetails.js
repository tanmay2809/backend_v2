const mongoose = require("mongoose");
const customerRecord = require("./customerRecord");
const Schema = mongoose.Schema;

const restaurantDetails = new Schema({
  name: {
    type: String,
    // required: true,
  },
  //   image: {
  //     type: String,
  //   },
  contact: {
    type: String,
    // required: true,
  },
  cuisineServed: {
    type: [String],
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RestaurantProfile",
  },
  paymentOptions: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentOption",
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  ],
  menu: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menuItem",
    },
  ],
  recommendedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userProfile",
    },
  ],
  recommendationCount: {
    type: Number,
    default: 0,
  },
  totalCustomersData: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "analytics",
    },
  ],
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
  returningCustomerData: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userProfile",
    },
  ],
  totalCustomers: {
    type: Number,
    dafault: 0,
  },
  happyHourOffers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HappyHour",
    },
  ],
  returningCustomer: {
    type: Number,
    default: 0,
  },
  customerData : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : "customerRecord",
    }
  ]
});

const RestaurantDetails = mongoose.model(
  "restaurantDetails",
  restaurantDetails
);

module.exports = RestaurantDetails;