const express = require('express');
const router =  express.Router();

const { toggleRecommendation } = require('../controllers/restaurantRecommendation')

router.put('/toggleRecommendation/:userId/:restaurantId',toggleRecommendation);

module.exports = router;