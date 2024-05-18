const menuItem = require('../models/menuItem');
const analytics = require('../models/analytics');
const restaurantDetails = require('../models/restaurantDetails');

const updateRating = async (req, res) => {
    
    try {


        const { rated,resId } = req.body;
        const userId = req.params.userId;
        const menuId = req.params.menuId;
        
        const menu = await menuItem.findById(menuId);

        if (rated === 'mustTry') {
            menu.liked.pull(userId);
            menu.notLiked.pull(userId);
        } else if (rated === 'liked') {
            menu.mustTry.pull(userId);
            menu.notLiked.pull(userId);
        } else if (rated === 'notLiked') {
            menu.mustTry.pull(userId);
            menu.liked.pull(userId);
        }

        const index = menu[rated].indexOf(userId);
        if (index == -1) {
            menu[rated].push(userId);
        }

        menu.mustTryCount = menu.mustTry.length;
        menu.likedCount = menu.liked.length;
        menu.notLikedCount = menu.notLiked.length;

        const averageRating = Math.round((menu.mustTryCount + menu.likedCount) / 2);

        menu.rated = averageRating;
        
        await menu.save();


        //for total and returning customer 
        
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

            //if not present
            if (!match) {
                restaurant.returningCustomerData.push(userId);
                restaurant.returningCustomer = restaurant.returningCustomerData.length;
                await restaurant.save();
            }
        }

        res.status(200).json({ 
            message: "Rating updated successfully" 
        });
        
    } catch (error) {
        console.error("Error updating rating:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

module.exports = { updateRating };
