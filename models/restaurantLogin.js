const mongoose = require("mongoose");

const restaurantLogin = new mongoose.Schema({
  
  details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RestaurantDetails",
  },
  email : {
    type: String,
    // required:true,
  },

  password: {
    type: String,
    // required:true,
  },

});

const login = mongoose.model("restaurantLogin",restaurantLogin);
module.exports = login;