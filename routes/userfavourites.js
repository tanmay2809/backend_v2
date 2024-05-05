const express = require("express");
const router = express.Router();
const { addToFavorites } = require("../controllers/userfavourite");``
// Route to add a menu item to favorites
router.put("/favourites/:userId/:menuItemId",addToFavorites);

module.exports = router;
