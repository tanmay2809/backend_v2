const express = require('express');
const router =  express.Router();

const {
  registerRestaurant,
  login,
  getRestaurantDetailsById,
  forgotPassword,
  resetPasswordPage,
  resetPassword,
  updateRestaurantDetails,
} = require("../controllers/restaurantLoginHandler");


router.post("/restaurants/:id", updateRestaurantDetails);
router.post('/regsiterRestaurant' , registerRestaurant);
router.post("/reset-password/:id/:token", resetPassword);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:id/:token", resetPasswordPage);
router.get('/restaurantLogin' ,login);
router.get('/getRestaurantDetails/:id',getRestaurantDetailsById);

module.exports = router;