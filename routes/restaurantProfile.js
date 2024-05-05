const express = require("express");
const router = express.Router();
const {
  addRestaurantProfile,
  getRestaurantProfileById,
  updateRestaurantProfile,
} = require("../controllers/resProfile");

// Define route to add a new restaurant profile
router.post("/resProfile/:id", addRestaurantProfile);
router.get("/resProfile/:id", getRestaurantProfileById);
router.put("/resProfile/:id", updateRestaurantProfile);


module.exports = router;
