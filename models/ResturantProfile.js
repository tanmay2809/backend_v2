const mongoose = require("mongoose");

const restaurantProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image:{
    type:"String",
    required:true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  outletAddress: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
  },
  cuisine: {
    type: [String],
    required: true,
  },
  instaLink: {
    type: String,
  },
  fssaiLicenseNo: {
    type: String,
    required: true,
  },
});

const RestaurantProfile = mongoose.model(
  "RestaurantProfile",
  restaurantProfileSchema
);

module.exports = RestaurantProfile;
