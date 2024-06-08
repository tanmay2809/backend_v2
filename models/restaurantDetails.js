const mongoose = require("mongoose");
const customerRecord = require("./customerRecord");
const recommendationRecord = require("./recommendationRecord");
const Schema = mongoose.Schema;

const restaurantDetails = new Schema({
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
  },
  image: {
    type: String,
  },
  outletAddress: {
    type: String,
  },

  contact: {
    type: String,
    // required: true,
  },
  cuisineServed: {
    type: [String],
  },
  fssaiLicenseNo: {
    type: String,
    // required: true,
  },
  gst: {
    type: String,
    // required: true,
  },
  instaLink: {
    type: String,
  },
  contactNo: {
    type: String,
    // required: true,
  },
  contactPerson: {
    type: String,
    // required: true,
  },
  outletAddress: {
    type: String,
    // required: true,
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
  customerData: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customerRecord",
    },
  ],
  recommendationRecord: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recommendationRecord",
    },
  ],
});

const RestaurantDetails = mongoose.model(
  "restaurantDetails",
  restaurantDetails
);

module.exports = RestaurantDetails;