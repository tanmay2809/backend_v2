const express = require('express');
const router =  express.Router();

const {
  getCategory,
  addCategory,
  deleteCategory,
  toggleActiveStatusById,
  updateCategory,
} = require("../controllers/categoryHandler");


router.put("/updateorder/:restaurantId", updateCategory);
router.post('/addCategory/:id',addCategory);
router.delete('/deleteCategory/:id',deleteCategory);
router.put('/updateStatus',toggleActiveStatusById);
router.get('/getCategory/:id',getCategory);

module.exports = router;