const express = require('express');
const router =  express.Router();

const { updateVisitorsCount,updateVisitorsData } = require('../controllers/visitorsRecord')

router.put('/updateVisitorsData/:userId/:restaurantId',updateVisitorsData);
router.put('/updateVisitorsCount/:restaurantId',updateVisitorsCount);

module.exports = router;