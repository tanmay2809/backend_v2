const express = require("express");
const router = express.Router();
const {addToFavorites,getFavoriteMenuItems,} = require("../controllers/userfavourite");



// Route to add a menu item to favorites
router.put("/favourites/:userId/:menuItemId/:resId",addToFavorites);
router.get("/favourites/:userId", getFavoriteMenuItems);
module.exports = router;