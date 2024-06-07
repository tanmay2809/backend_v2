const mongoose = require("mongoose");

const paymentOptionSchema = new mongoose.Schema({
  payoutMethod: {
    type: String,
    enum: ["BankTransfer", "upi"],
    required: true,
  },
  bankTransfer: {
    accountNumber: String,
    ifsc: String,
    bankingName: String,
  },
  upi: {
    upiId: String,
    bankingName: String,
  },
});

const PaymentOption = mongoose.model("PaymentOption", paymentOptionSchema);

module.exports = PaymentOption;
