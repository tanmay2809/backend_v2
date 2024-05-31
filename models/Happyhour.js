const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const happyHourSchema = new Schema({
  offerName: {
    type: String,
    trim: true,
  },
  UserId: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userProfile",
    },
  
  discountPercentage: {
    type: Number,
  },
  maximumDiscountValue: {
    type: Number,
  },
  minimumPurchaseValue: {
    type: Number,
  },
  additionalTermsAndConditions: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const HappyHour = mongoose.model("HappyHour", happyHourSchema);

module.exports = HappyHour;
