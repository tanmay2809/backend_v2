const express = require('express');
const router =  express.Router();

const { addComment, pinComment } = require("../controllers/commentHandler");

router.post('/addComment/:userId/:menuId' , addComment);
router.post("/pinComment/:commentId/:menuId", pinComment);


module.exports = router;