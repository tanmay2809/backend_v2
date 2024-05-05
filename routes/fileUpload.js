const express = require("express");
const router = express.Router();


const fileUpload = require("../controllers/fileUpload")
const uploadMiddleWare = require("../middleware/fileUploader");

router.post("/fileUpload",uploadMiddleWare.single("file"),fileUpload);

module.exports = router;