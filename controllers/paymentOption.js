const RestaurantDetails = require("../models/restaurantDetails");
const PaymentOption = require("../models/paymentOption");
const createPaymentOption = async (req, res) => {
  try {
    const {
      payoutMethod,
      bankAccount,
      ifsc,
      bankingName,
      upiId,
      bankingNameUpi,
    } = req.body;

    // Validate method
    if (!payoutMethod || !["BankTransfer", "upi"].includes(payoutMethod)) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // Validate bank transfer details if method is BankTransfer
    if (
      payoutMethod === "BankTransfer" &&
      (!bankAccount || !ifsc || !bankingName)
    ) {
      return res
        .status(400)
        .json({ error: "Incomplete bank transfer details" });
    }

    // Validate UPI details if method is upi
    if (payoutMethod === "upi" && (!upiId || !bankingNameUpi)) {
      return res.status(400).json({ error: "Incomplete UPI details" });
    }

    const newPaymentOption = new PaymentOption({
      payoutMethod,
      bankTransfer:
        payoutMethod === "BankTransfer"
          ? {
              accountNumber: bankAccount,
              ifsc,
              bankingName,
            }
          : undefined,
      upi:
        payoutMethod === "upi"
          ? {
              upiId,
              bankingName: bankingNameUpi,
            }
          : undefined,
    });

    const savedPaymentOption = await newPaymentOption.save();

    // Push payment option ID into restaurant details
    const restaurantDetailsId = req.params.restaurantDetailsId;
    const restaurantDetails = await RestaurantDetails.findById(
      restaurantDetailsId
    );

    if (!restaurantDetails) {
      return res.status(404).json({ error: "Restaurant details not found" });
    }

    restaurantDetails.paymentOptions = savedPaymentOption._id;
    await restaurantDetails.save();

    res.status(201).json({
      message:
        "Payment option created and linked to restaurant details successfully",
      paymentOption: savedPaymentOption,
    });
  } catch (error) {
    console.error("Error creating payment option:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createPaymentOption,
};

const getPaymentOptionsId = async (req, res) => {
  try {
    const restaurantDetailsId = req.params.restaurantDetailsId;
    const restaurantDetails = await RestaurantDetails.findById(
      restaurantDetailsId
    ).populate("paymentOptions");

    if (!restaurantDetails) {
      return res.status(404).json({ error: "Restaurant details not found" });
    }

    res.status(200).json({ paymentOptions: restaurantDetails.paymentOptions });
  } catch (error) {
    console.error("Error fetching payment options:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePaymentOptionsById = async (req, res) => {
  try {
    const restaurantDetailsId = req.params.restaurantDetailsId;
    const { method, accountNo, ifscCode, beneficiaryName, upiId, upiNumber } =
      req.body;

    const restaurantDetails = await RestaurantDetails.findById(
      restaurantDetailsId
    );

    if (!restaurantDetails) {
      return res.status(404).json({ error: "Restaurant details not found" });
    }

    // Create or update payment option based on method
    let paymentOption;
    if (method === "bank_transfer") {
      paymentOption = {
        method,
        bankTransfer: { accountNo, ifscCode, beneficiaryName },
        upi: undefined,
      };
    } else if (method === "upi") {
      paymentOption = {
        method,
        bankTransfer: undefined,
        upi: { upiId, upiNumber },
      };
    } else {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // Update or create payment option
    if (restaurantDetails.paymentOptions.length > 0) {
      // Update existing payment option
      restaurantDetails.paymentOptions[0].set(paymentOption);
      await restaurantDetails.paymentOptions[0].save();
    } else {
      // Create new payment option
      const newPaymentOption = new PaymentOption(paymentOption);
      await newPaymentOption.save();
      restaurantDetails.paymentOptions.push(newPaymentOption);
    }

    await restaurantDetails.save();

    res.status(200).json({ message: "Payment options updated successfully" });
  } catch (error) {
    console.error("Error updating payment options:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createPaymentOption,
  getPaymentOptionsId,
  updatePaymentOptionsById,
};
