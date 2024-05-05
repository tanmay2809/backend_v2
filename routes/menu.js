const express = require('express');
const router =  express.Router();

const { addMenu,toggleMenuStatus,updateMenu,getMenuByCategory,getMenuById,searchMenu,getTop5 } = require('../controllers/menuHandler');

router.post('/addMenu/:id',addMenu);
router.put('/toggleMenuStatus',toggleMenuStatus);
router.put('/updateMenu/:id',updateMenu);
router.get('/getMenuByCategory/:id',getMenuByCategory);
router.get('/getMenuById/:id',getMenuById);
router.get('/searchMenu/:restaurantId/:search',searchMenu);
router.get('/getTop5/:id',getTop5);

module.exports = router;