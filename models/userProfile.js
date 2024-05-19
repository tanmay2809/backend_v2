const mongoose = require("mongoose");

const userProfile = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  // profileImage: {
  //   type: String,
  // },
  gender: {
    type: String,
    // required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
  },
  foodPreference: {
    type: String,
  },
  anniversary: {
    type: String,
  },
  recommendedRestaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurantDetails",
    },
  ],
  recommendedDishes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menuItem",
    },
  ],
  favoriteMenuItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menuItem",
    },
  ]
});

const user = mongoose.model("userProfile",userProfile);
module.exports = user;
