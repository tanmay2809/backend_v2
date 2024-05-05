const MenuItem = require("../models/menuItem");
const userProfile = require("../models/userProfile");

const addToFavorites = async (req, res) => {
  try {
    const userId = req.params.userId;
    const menuItemId = req.params.menuItemId;

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

    // Check if the menu item is already in user's favorites
    const index = user.favoriteMenuItems.indexOf(menuItemId);
    if (index === -1) {
      // Menu item not found in favorites, add it
      user.favoriteMenuItems.push(menuItemId);
    } else {
      // Menu item found in favorites, remove it
      user.favoriteMenuItems.splice(index, 1);
    }

    await user.save();

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

    // Find the user by ID
    const user = await userProfile.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch the favorite menu items for the user and populate the 'menu' field
    const favoriteMenuItems = await MenuItem.find({
      _id: { $in: user.favoriteMenuItems },
    })

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
