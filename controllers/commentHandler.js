const comments = require('../models/comments');
const menuItem = require('../models/menuItem');
const analytics = require('../models/analytics');
const restaurantDetails = require('../models/restaurantDetails');
const customerRecord = require('../models/customerRecord');

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
            createdAt : Date.now(),
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
        // const isUserIdPresent = customerData.some((customer) => customer.userId.toString() === userId);
        if(customerData.length > 0) {
        const c = customerData.find((customer) => customer.userId.toString() === userId);
        // if (isUserIdPresent) {
        if(c){
            const customer = await customerRecord.findOne({_id : c._id});
            // const customer = await customerRecord.findOne({ userId });
            const date2 = new Date(customer.createdAt);
            if (!(date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate())) {
                customer.count += 1;
                customer.createdAt = date1;
                await customer.save();
            }
            else{
                customer.createdAt = date1;
                await customer.save();
            }
        }
        else {
            const newRecord = await customerRecord.create({ userId : userId, count: 1,createdAt : date1 });
            const res = await restaurantDetails.findOneAndUpdate(
                { _id : resId },
                { $push: { customerData: newRecord._id } },
                { new: true }
              );
        }
        }
        else {
             const newRecord = await customerRecord.create({ userId : userId, count: 1 });
            const res = await restaurantDetails.findOneAndUpdate(
                { _id : resId },
                { $push: { customerData: newRecord._id } },
                { new: true }
              );
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
        const updateMenu = await updatedMenu.populate("comments")
        // Update the Active field in the comment model
        await comments.findByIdAndUpdate(
            commentId,
            { $set: { Active: !isPinned ? "true" : "false" } } // Toggle Active state based on whether comment is being pinned or unpinned
        );

        res.status(200).json({
            message: `Comment ${isPinned ? "unpinned" : "pinned"} successfully`,
            data: updateMenu,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }

};

module.exports = { addComment, pinComment };
