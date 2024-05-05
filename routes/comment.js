const express = require('express');
const router =  express.Router();

const { addComment } = require('../controllers/commentHandler')

router.post('/addComment/:userId/:menuId' , addComment);

module.exports = router;