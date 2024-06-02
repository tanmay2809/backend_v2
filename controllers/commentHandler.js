const comments = require('../models/comments');
const menuItem = require('../models/menuItem');
const analytics = require('../models/analytics');
const restaurantDetails = require('../models/restaurantDetails');

const addComment = async (req, res) => {
    try {
        const { description, rated, resId } = req.body;
        const userId = req.params.userId;
        const menuId = req.params.menuId;

        const newComment = new comments({
            description,
            userId,
            rated
        });

        const savedComment = await newComment.save();

        const menu = await menuItem.findById(menuId);
        if (!menu) {
            return res.status(404).json({ error: "Menu item not found" });
        }

        menu.comments.push(savedComment._id);
        await menu.save();

        const analytic = new analytics({
            userId,
            // createdAt: "2024-05-12T14:19:14.311+00:00"
        });

        const savedAnalytics = await analytic.save();

        const restaurant = await restaurantDetails.findById(resId).populate('totalCustomersData').exec();
        if (!restaurant) {
            return res.status(500).json({ error: "Restaurant details not found" });
        }

        if (restaurant.totalCustomersData.length > 0) {
            const existingAnalytics = await analytics.find({
                _id: { $in: restaurant.totalCustomersData }
            });

            const hasDuplicate = existingAnalytics.some(entry =>
                entry.userId.toString() === userId && entry.createdAt.toISOString().slice(0, 10) === savedAnalytics.createdAt.toISOString().slice(0, 10)
            );

            if (!hasDuplicate) {
                restaurant.totalCustomersData.push(savedAnalytics._id);
                restaurant.totalCustomers = restaurant.totalCustomersData.length;
                await restaurant.save();
            }
        }
        else {
            restaurant.totalCustomersData.push(savedAnalytics._id);
            restaurant.totalCustomers = restaurant.totalCustomersData.length;
            await restaurant.save();
        }

        if (!Array.isArray(restaurant.returningCustomerData)) {
            restaurant.returningCustomerData = [];
        }

        const x = restaurant.returningCustomerData.includes(userId);
        if (!x)
        {
            //check krna hai ki vo user id present hai ki nahi totalCustomerData mein
            const match = restaurant.totalCustomersData.find(analyticsEntry => {
                if(analyticsEntry.userId === userId)
                {
                    if(analyticsEntry.createdAt.toISOString().slice(0, 10) === savedAnalytics.createdAt.toISOString().slice(0, 10))
                    {
                        return false;
                    }
                    return true;
                }
                return false;
                // return analyticsEntry.userId === userId && analyticsEntry.createdAt.toISOString().slice(0, 10) != savedAnalytics.createdAt.toISOString().slice(0, 10);
            });

            //if present
            if (!match) {
                restaurant.returningCustomerData.push(userId);
                restaurant.returningCustomer = restaurant.returningCustomerData.length;
                await restaurant.save();
            }
        }
    
        res.status(201).json({
            message: "Comment added successfully",
            comment: savedComment,
            details: restaurant
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

const pinComment = async (req, res) => {
  try {
    const { menuId, commentId } = req.params;

    // Find the menu item
    const menu = await menuItem.findById(menuId);

    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Check if the comment is already pinned
    const isPinned = menu.Pincomments.includes(commentId);

    let updatedMenu;
    if (isPinned) {
      // If the comment is pinned, remove it
      updatedMenu = await menuItem.findByIdAndUpdate(
        menuId,
        { $pull: { Pincomments: commentId } },
        { new: true }
      );
    } else {
      // If the comment is not pinned, add it
      updatedMenu = await menuItem.findByIdAndUpdate(
        menuId,
        { $push: { Pincomments: commentId } },
        { new: true }
      );
    }

    res.status(200).json({
      message: `Comment ${isPinned ? "unpinned" : "pinned"} successfully`,
      data: updatedMenu,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

module.exports = { addComment, pinComment };