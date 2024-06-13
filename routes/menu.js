const express = require('express');
const router =  express.Router();

const {
  addMenu,
  toggleMenuStatus,
  updateMenu,
  getMenuByCategory,
  getMenuById,
  searchMenu,
  getTop5,
  deleteMenu,
  updateCount,
} = require("../controllers/menuHandler");

router.post('/addMenu/:id',addMenu);
router.put('/toggleMenuStatus',toggleMenuStatus);
router.post('/updateMenu/:id',updateMenu);
router.get('/getMenuByCategory/:id',getMenuByCategory);
router.get('/getMenuById/:id',getMenuById);
router.get('/searchMenu/:restaurantId/:search',searchMenu);
router.get('/getTop5/:id',getTop5);
router.delete("/deleteMenu/:id", deleteMenu);
router.put("/updateCount/:menuId",updateCount);

module.exports = router;