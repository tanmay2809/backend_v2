const express = require('express');
const router =  express.Router();

const {
  addUser,
  checkContactExists,
  updateUser,
} = require("../controllers/userProfile");

router.post('/addUser',addUser);
router.get('/checkContactExists/:phoneNumber',checkContactExists);
router.put("/user/:userId",updateUser);

module.exports = router;