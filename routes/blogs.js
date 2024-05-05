const express = require('express');
const router =  express.Router();

const {addBlog, editBlog, getBlog,deleteBlog, getBlogById } = require('../controllers/blogs');

router.post("/addBlog" ,addBlog );
router.get("/getBlogs",getBlog);
router.put('/editBlog/:id', editBlog);
router.delete('/deleteBlog/:id',deleteBlog);
router.get('/getBlogById/:id',getBlogById);

module.exports = router;