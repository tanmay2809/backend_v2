const mongoose = require("mongoose");

const paymentOptionSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ["bank_transfer", "upi"],
    required: true,
  },
  bankTransfer: {
    accountNo: String,
    ifscCode: String,
    beneficiaryName: String,
  },
  upi: {
    upiId: String,
    upiNumber: String,
  },
});

const PaymentOption = mongoose.model("PaymentOption", paymentOptionSchema);

module.exports = PaymentOption;
