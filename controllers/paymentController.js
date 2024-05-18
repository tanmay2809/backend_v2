const { instance } = require("../config/razorpayinstance");
const RestaurantDetails = require("../models/restaurantDetails");
const Payment = require("../models/paymentModel");
const shortid = require("shortid");
const crypto = require("crypto");
const axios = require("axios")


exports.capturePaymentForRestaurant = async (req, res) => {
  try {
    //const { restaurantId } = req.params;
    const { amount } = req.body;
    console.log(req.body);

    // Find the restaurant details using the provided restaurant ID

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: shortid.generate(),
    };

    const order = await instance.orders.create(options);
    console.log(order);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.verifyPaymentForRestaurant = async (req, res) => {
  console.log(req.body);
   const { id, amount, userId } = req.body.bodydata;
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body.bodydata;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(200)
        .json({ success: false, message: "Payment Failed" });
    }
   let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Process further actions (e.g., update restaurant status, send confirmation emails, etc.)
      const final = await savepayment(amount, id, razorpay_payment_id, userId, res);
      return res.status(200).json({
        success: true,
        data: final,
        message: "Payment verified successfully",
      });
    } else {
      // Update payment status as failed in the database

      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const savepayment = async (amount, id, razorpay_payment_id ,userId, res) => {
    // let paymentmode;
    // let config = {
    //   method: "get",
    //   maxBodyLength: Infinity,
    //   url: `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
    //   headers: {},
    // };

    // axios
    //   .request(config)
    //   .then((response) => {
    //     console.log(JSON.stringify(response.data));
    //     paymentmode = JSON.stringify(response.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    
      let payment_mode = instance.payments.fetch(razorpay_payment_id);
      console.log(payment_mode)

//   const payment = new Payment({
//     amount: amount,
//     // mode:paymentmode,
//     user: userId,
// });
//   await payment.save();
//   const reestaurant = await RestaurantDetails.findOneAndUpdate(
//     { _id: id },
//     { $push: { payments: payment._id } },
//     { new: true } // Return the updated document
//   );
};

exports.getPaymentsByRestaurant = async (req, res) => {
  const { resid } = req.params;

  try {
    const payments = await Payment.find({ restaurant: resid }).populate(
      "userId",
      "name"
    ); // Populate userId with the name field

    if (!payments) {
      return res
        .status(404)
        .json({ message: "No payments found for this restaurant" });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving payments" });
  }
};

