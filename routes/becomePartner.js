// Import required modules
const express = require("express");
const router = express.Router();

// Import the controller functions for handling become partner data
const {
  becomePartnerDataToDB,
  getAllBecomePartners,
} = require("../controllers/becomePartner");

// Define the routes
router.post("/becomepartner", becomePartnerDataToDB);
router.get("/becomepartner", getAllBecomePartners);

module.exports = router;