const MenuItem = require("../models/menuItem");
const userProfile = require("../models/userProfile");
const analytics = require('../models/analytics');
const restaurantDetails = require('../models/restaurantDetails');
const customerRecord = require('../models/customerRecord');

const addToFavorites = async (req, res) => {
  try {
    const userId = req.params.userId;
    const menuItemId = req.params.menuItemId;
    const resId = req.params.resId;

    const user = await userProfile.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }


      let favoriteRestaurant = user.favoriteMenuItems.find(favorite => favorite.resId === String(resId));

    if (!favoriteRestaurant) {
      user.favoriteMenuItems.push({
        resId: resId,
        menuItems: [menuItemId]
      });
    }
    else {
      const menuItemIndex = favoriteRestaurant.menuItems.indexOf(menuItemId);

      if (menuItemIndex === -1) {
        favoriteRestaurant.menuItems.push(menuItemId);
      } else {
        favoriteRestaurant.menuItems.splice(menuItemIndex, 1);

        if (favoriteRestaurant.menuItems.length === 0) {
          user.favoriteMenuItems = user.favoriteMenuItems.filter(favorite => favorite.resId.toString() !== resId);
        }
      }
    }

    await user.save();

    const analytic = new analytics({
      userId,
      createdAt: Date.now(),
    });

    const savedAnalytics = await analytic.save();

    const restaurant = await restaurantDetails.findById(resId).populate('totalCustomersData').exec();
    if (!restaurant) {
      return res.status(500).json({ error: "Restaurant details not found" });
    }

    //total returning
    if (!Array.isArray(restaurant.returningCustomerData)) {
      restaurant.returningCustomerData = [];
    }

    const x = restaurant.returningCustomerData.includes(userId);
    if (!x) {
      //check krna hai ki vo user id present hai ki nahi totalCustomerData mein
      const match1 = restaurant.totalCustomersData.some(analyticsEntry => {
        return analyticsEntry.userId.equals(userId) &&
          analyticsEntry.createdAt.toISOString().slice(0, 10) === savedAnalytics.createdAt.toISOString().slice(0, 10);
      });

      const match2 = restaurant.totalCustomersData.some(analyticsEntry => {
        return analyticsEntry.userId.equals(userId);
      });

      //if not present
      if (!match1 && match2) {
        restaurant.returningCustomerData.push(userId);
        restaurant.returningCustomer = restaurant.returningCustomerData.length;
        await restaurant.save();
      }
    }


    //total customers
    const rest1 = await restaurantDetails.findById(resId).populate('totalCustomersData').exec();
    if (rest1.totalCustomersData.length > 0) {
      const existingEntry = rest1.totalCustomersData.find(data => {
        return data.userId.equals(userId) && new Date(data.createdAt).toISOString().slice(0, 10) === new Date(savedAnalytics.createdAt).toISOString().slice(0, 10)
      });

      if (!existingEntry) {
        rest1.totalCustomersData.push(savedAnalytics._id);
        rest1.totalCustomers = rest1.totalCustomersData.length;
        await rest1.save();
      }
    }
    else {
      rest1.totalCustomersData.push(savedAnalytics._id);
      rest1.totalCustomers = rest1.totalCustomersData.length;
      await rest1.save();
    }

    //for customer Record
    const date1 = new Date();
    const restaurant1 = await restaurantDetails.findById(resId).populate('customerData').exec();
    const customerData = restaurant1.customerData;
    if (customerData.length > 0) {
      const c = customerData.find((customer) => customer.userId.toString() === userId);
      if (c) {
        const customer = await customerRecord.findOne({ _id: c._id });
        const date2 = new Date(customer.createdAt);
        if (!(date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate())) {
          customer.count += 1;
          customer.createdAt = date1;
          await customer.save();
        }
        else {
          customer.createdAt = date1;
          await customer.save();
        }
      }
      else {
        const newRecord = await customerRecord.create({ userId: userId, count: 1, createdAt: date1 });
        const res = await restaurantDetails.findOneAndUpdate(
          { _id: resId },
          { $push: { customerData: newRecord._id } },
          { new: true }
        );
      }
    }
    else {
      const newRecord = await customerRecord.create({ userId: userId, count: 1 });
      const res = await restaurantDetails.findOneAndUpdate(
        { _id: resId },
        { $push: { customerData: newRecord._id } },
        { new: true }
      );
    }


    res
      .status(200)
      .json({ message: "Menu item toggled in favorites successfully" });
  } catch (error) {
    console.error("Error toggling menu item in favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getFavoriteMenuItems = async (req, res) => {
try {
  const userId = req.params.userId;
  const resId = req.params.resId;

  // Validate that userId and resId are provided
  if (!userId || !resId) {
    return res.status(400).json({ error: "User ID and Restaurant ID are required" });
  }

  // Find the user by ID
  const user = await userProfile.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Check if the restaurant exists in user's favorites
  let favoriteRestaurant = user.favoriteMenuItems.find(favorite => favorite.resId === String(resId));

  if (!favoriteRestaurant) {
    return res.status(404).json({ favoriteMenuItems: [] });
  }

  // Fetch the favorite menu items for the user and populate the 'menuItems' field
  const favoriteMenuItems = await MenuItem.find({
    _id: { $in: favoriteRestaurant.menuItems }
  });

  res.status(200).json({ favoriteMenuItems });
} catch (error) {
  console.error("Error fetching favorite menu items:", error);
  res.status(500).json({ error: "Internal server error" });
}
};



module.exports = {
  addToFavorites,
  getFavoriteMenuItems,
};
