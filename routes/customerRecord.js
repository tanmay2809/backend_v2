const express = require('express');
const router =  express.Router();

const { searchRecord } = require('../controllers/customerRecord');

router.get('/searchRecord/:resId/:search', searchRecord);

module.exports = router;