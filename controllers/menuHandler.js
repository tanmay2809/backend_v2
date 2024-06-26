const categoryModel = require('../models/category');
const menuItem = require('../models/menuItem');
const restaurantDetails = require('../models/restaurantDetails');
const comments = require('../models/comments');
const addMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      image,
      description,
      price,
      veg,
      category,
      variants1,
      variants1Price,
      variants2,
      variants2Price,
      variants3,
      variants3Price,
    } = req.body;



    // Create the menu item
    const newMenu = new menuItem({
      name,
      image,
      description,
      price,
      veg,
      category,
      variants1,
      variants1Price,
      variants2,
      variants2Price,
      variants3,
      variants3Price,
    });


    const savedMenu = await newMenu.save();

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      category,
      { $push: { menuItems: savedMenu._id } },
      { new: true }
    );

    const updatedResDetails = await restaurantDetails.findByIdAndUpdate(
      id,
      { $push: { menu: savedMenu._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Menu added successfully",
      menu: savedMenu,
      updatedCategory: updatedCategory,
      updatedRestaurantDetails: updatedResDetails,
    });
  } catch (error) {
    console.error("Error adding menu:", error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};

const toggleMenuStatus = async (req, res) => {
  try {
    const { menuId } = req.body;

    const foundMenu = await menuItem.findById(menuId);

    if (!foundMenu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    foundMenu.active = !foundMenu.active;

    await foundMenu.save();

    res.status(200).json({
      message: "Menu active status toggled successfully",
      updatedMenu: foundMenu
    });

  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};

const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      image,
      veg,
      variants1,
      variants1Price,
      variants2,
      variants2Price,
      variants3,
      variants3Price,
      category,
      itemCategory
    } = req.body;

    console.log(req.body)
    console.log(itemCategory);
    const updates = {};

    // Remove the item from the old category and add it to the new category
    if (category && itemCategory && category != itemCategory) {
      await Promise.all([
        categoryModel.findByIdAndUpdate(itemCategory, {
          $pull: { menuItems: id },
        }),
        categoryModel.findByIdAndUpdate(category, {
          $addToSet: { menuItems: id },
        }),
      ]);
    }


    if (name) updates.name = name;
    if (description) updates.description = description;
    if (price) updates.price = price;
    if (image) updates.image = image;
    if (veg) updates.veg = veg;
    if (variants1) updates.variants1 = variants1;
    if (variants1Price) updates.variants1Price = variants1Price;
    if (variants2) updates.variants2 = variants2;
    if (variants2Price) updates.variants2Price = variants2Price;
    if (variants3) updates.variants3 = variants3;
    if (variants3Price) updates.variants3Price = variants3Price;
    if (category) updates.category = category;

    const updatedMenu = await menuItem.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedMenu) {
      return res.status(404).json({
        error: "Menu item not found",
      });
    }

    res.status(200).json({
      message: "Menu updated successfully",
      menu: updatedMenu,
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getMenuByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id).populate('menuItems').populate('pinComments').exec();

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ category });
  } catch (error) {
    console.error('Error fetching category details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMenuById = async (req, res) => {
  try {
    const menuId = req.params.id;

    const menu = await menuItem
      .findById(menuId)
      .populate("comments")
      .populate("Pincomments");

    if (!menu) {
      return res.status(404).json({
        message: 'Menu item not found'
      });
    }

    await Promise.all(menu.comments.map(async (menuId, index) => {
      menu.comments[index] = await comments.findById(menuId._id).populate('userId');
    }));

    res.status(200).json({
      message: "Menu fetched successfully",
      menu
    });
  } catch (error) {
    console.error('Error fetching menu item details:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const searchMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const searchValue = req.params.search;

    const restaurant = await restaurantDetails.findById(restaurantId).populate({
      path: "menu",
      populate: [
        { path: "comments", },
        { path: "Pincomments", },
      ],
    });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const matchedMenuItems = restaurant.menu.filter(menuItem => {
      return menuItem.name.toLowerCase().includes(searchValue.toLowerCase());
    });

    res.json({ menuItems: matchedMenuItems });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTop5 = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const restaurant = await restaurantDetails.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menuItems = await menuItem.find({ _id: { $in: restaurant.menu } })
      .sort({ rated: -1 })
      .limit(5);

    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the menu item by its ID and delete it
    const deletedMenu = await menuItem.findByIdAndDelete(id);

    if (!deletedMenu) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Remove the deleted menu item from the associated category
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      deletedMenu.category,
      { $pull: { menuItems: deletedMenu._id } },
      { new: true }
    );

    // Remove the deleted menu item from the associated restaurant details
    const updatedResDetails = await restaurantDetails.findByIdAndUpdate(
      deletedMenu.restaurant,
      { $pull: { menu: deletedMenu._id } },
      { new: true }
    );

    res.status(200).json({
      message: "Menu deleted successfully",
      deletedMenu,
      updatedCategory,
      updatedRestaurantDetails: updatedResDetails,
    });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const updateCount = async (req, res) => {
  try {
    const { menuId } = req.params;
    const menu = await menuItem.findById(menuId).exec();
    if (!menu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    menu.clicks = menu.clicks + 1;

      const updatedMenu = await menu.save();
      return res.status(200).json({ 
        message: 'Menu count updated', 
        data: updatedMenu 
      });

  }
  catch (error) {
    console.error('Error updating menu count:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}



module.exports = {
  addMenu,
  toggleMenuStatus,
  updateMenu,
  getMenuByCategory,
  getMenuById,
  searchMenu,
  getTop5,
  deleteMenu,
  updateCount
};
