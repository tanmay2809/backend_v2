const express = require('express');
const router =  express.Router();

const { updateRating } = require('../controllers/menuRecommendation')

router.put('/updateRating/:userId/:menuId' , updateRating);

module.exports = router;