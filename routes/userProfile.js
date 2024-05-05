const express = require('express');
const router =  express.Router();

const { addUser,checkContactExists } = require('../controllers/userProfile')

router.post('/addUser',addUser);
router.get('/checkContactExists/:phoneNumber',checkContactExists);

module.exports = router;