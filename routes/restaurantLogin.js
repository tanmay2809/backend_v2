const express = require('express');
const router =  express.Router();

const { registerRestaurant,login,getRestaurantDetailsById } = require('../controllers/restaurantLoginHandler');

router.post('/regsiterRestaurant' , registerRestaurant);
router.get('/restaurantLogin' ,login);
router.get('/getRestaurantDetails/:id',getRestaurantDetailsById);

module.exports = router;