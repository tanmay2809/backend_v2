// BecomePartner.js

const mongoose = require("mongoose");

// Define the schema
const becomePartnerSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

// Create a model using the schema
const BecomePartner = mongoose.model("BecomePartner", becomePartnerSchema);

module.exports = BecomePartner;
