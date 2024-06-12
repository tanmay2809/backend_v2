const bcrypt = require("bcrypt");
const restaurantDetails = require("../models/restaurantDetails");
const restaurantLogin = require("../models/restaurantLogin");
const categorySchema = require("../models/category");
const menuItemSchema = require("../models/menuItem");
const mailSender = require("../utils/mailSender");
const { resetPasswordEmail } = require("../mail/template/resetPasswordEmail");
const jwt = require("jsonwebtoken");
const userProfile = require("../models/userProfile");
const analytics = require("../models/analytics");
const customerRecord = require("../models/customerRecord");
const PaymentOption = require("../models/paymentOption");

const registerRestaurant = async (req, res) => {
  try {
    console.log(req.body);
    const {
      brandName,
      contactNumber,
      businessType,
      email,
      password,
      fssai,
      gst,
      payoutMethod,
      bankAccount,
      ifsc,
      bankingName,
      upiId,
    } = req.body;

    const existingRestaurant = await restaurantLogin.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({
        error: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRestaurantDetails = new restaurantDetails({
      name: brandName,
      email: email,
      fssaiLicenseNo: fssai,
      gst,
      contact: contactNumber,
      cuisineServed: businessType,
    });

    const savedRestaurantDetails = await newRestaurantDetails.save();
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
              bankingName: bankingName,
            }
          : undefined,
    });

    const savedPaymentOption = await newPaymentOption.save();
    const restaurantDetailsId = savedRestaurantDetails._id;
    const restaurantDetail = await restaurantDetails.findById(
      restaurantDetailsId
    );

    if (!restaurantDetail) {
      return res.status(404).json({ error: "Restaurant details not found" });
    }

    restaurantDetail.paymentOptions = savedPaymentOption._id;
    await restaurantDetail.save();

    const newRestaurantLogin = new restaurantLogin({
      details: savedRestaurantDetails._id,
      email,
      password: hashedPassword,
    });

    const savedRestaurantLogin = await newRestaurantLogin.save();

    res.status(201).json({
      message: "Restaurant registered successfully",
      restaurantDetails: savedRestaurantDetails._id,
      restaurantLogin: savedRestaurantLogin,
    });

    // const savedRestaurantLogin = await newRestaurantLogin.save();

    // await savedRestaurantLogin.populate('details').execPopulate();

    // res.status(201).json({
    //     message: "Restaurant registered successfully",
    //     restaurantLogin: savedRestaurantLogin
    // });
  } catch (error) {
    console.error("Error registering restaurant:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const restaurant = await restaurantLogin.findOne({ email });
    if (!restaurant) {
      return res.status(401).json({
        error: "Restaurant not registered",
      });
    }

    const passwordMatch = await bcrypt.compare(password, restaurant.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      details: restaurant.details._id,
    });
  } catch (error) {
    console.error("Error logging in restaurant:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// const getRestaurantDetailsById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const restaurant = await restaurantDetails.findById(id).populate('category').populate('menu');

//         if (!restaurant) {
//             return res.status(404).json({
//                 message: 'Restaurant details not found'
//             });
//         }

//         res.status(200).json({
//             message : 'Data fetched successfully',
//             restaurant
//          });

//     } catch (error) {
//         console.error('Error fetching restaurant details:', error);
//         res.status(500).json({
//             message: 'Internal server error'
//         });
//     }
// };

const getRestaurantDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await restaurantDetails
      .findById(id)
      .populate("category")
      .populate("menu")
      .populate("totalCustomersData")
      .populate("customerData")
      .populate("recommendationRecord");

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant details not found",
      });
    }

    // Populate userId field for each customer
    await Promise.all(
      restaurant.totalCustomersData.map(async (tid, index) => {
        restaurant.totalCustomersData[index] = await analytics
          .findById(tid._id)
          .populate({
            path: "userId",
          });
      })
    );

    // Populate userId field for customerData
    await Promise.all(
      restaurant.customerData.map(async (cid, index) => {
        restaurant.customerData[index] = await customerRecord
          .findById(cid._id)
          .populate({
            path: "userId",
          });
      })
    );

    // Populate menuItem field for each category
    await Promise.all(
      restaurant.category.map(async (categoryId, index) => {
        restaurant.category[index] = await categorySchema
          .findById(categoryId._id)
          .populate({
            path: "menuItems",
            populate: { path: "comments" },
            populate: { path: "Pincomments" }, // Populate the comments field within menuItems
          });
      })
    );

    // Populate comments field for each menu item
    await Promise.all(
      restaurant.menu.map(async (menuId, index) => {
        restaurant.menu[index] = await menuItemSchema
          .findById(menuId)
          .populate({ path: "comments", populate: { path: "userId" } });
      })
    );

    res.status(200).json({
      message: "Data fetched successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await restaurantLogin.findOne({ email });
    if (!oldUser) {
      return res.json({ status: " restaurant Not Exists!!" });
    }
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:4000/api/reset-password/${oldUser._id}/${token}`;

    const mail = await mailSender(
      email,
      "Greetings From Snackbae",
      resetPasswordEmail(link)
    );

    console.log(link);
    res.status(201).json({ status: "Password reset link sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPasswordPage = async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await restaurantLogin.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "restaurant Not Exists!!" });
  }
  const secret = process.env.JWT_SECRET;
  try {
    const verify = jwt.verify(token, secret);
    // res.render("index", { email: verify.email, status: "Not Verified" });
    res.send("Verified");
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await restaurantLogin.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "restaurant Not Exists!!" });
  }
  const secret = JWT_SECRET;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await restaurantLogin.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
};


const updateRestaurantDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      image,
      outletAddress,
      contact,
      cuisinesServed,
      fssaiLicenceNumber,
      gst,
      instaLink,
      contactNo,
      contactPerson,
    } = req.body;

    console.log(req.body);

    const updates = {};

    // Use if statements to add updates
    if (name) updates.name = name;
     // if (email) updates.email = email;
    if (image) updates.image = image;
    if (outletAddress) updates.outletAddress = outletAddress;
    if (contact) updates.contact = contact;
    if (cuisinesServed) updates.cuisineServed = cuisinesServed;
    if (fssaiLicenceNumber) updates.fssaiLicenseNo = fssaiLicenceNumber;
    if (gst) updates.gst = gst;
    if (instaLink) updates.instaLink = instaLink;
    if (contactNo) updates.contactNo = contactNo;
    if (contactPerson) updates.contactPerson = contactPerson;

    const updatedRestaurant = await restaurantDetails.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ error: "Restaurant details not found" });
    }

    res.status(200).json({
      message: "Restaurant details updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error("Error updating restaurant details:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};




module.exports = {
  registerRestaurant,
  login,
  getRestaurantDetailsById,
  forgotPassword,
  resetPasswordPage,
  resetPassword,
  updateRestaurantDetails,
};
