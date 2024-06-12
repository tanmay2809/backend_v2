const menuItem = require('../models/menuItem');
const analytics = require('../models/analytics');
const restaurantDetails = require('../models/restaurantDetails');
const customerRecord = require('../models/customerRecord');
const recommendationRecord = require('../models/recommendationRecord');

const updateRating = async (req, res) => {

    try {


        const { rated, resId } = req.body;
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

            // const match = restaurant.totalCustomersData.find(analyticsEntry => {
            //     if (analyticsEntry.userId === userId) {
            //         if (analyticsEntry.createdAt.toISOString().slice(0, 10) === savedAnalytics.createdAt.toISOString().slice(0, 10)) {
            //             return false;
            //         }
            //         return true;
            //     }
            //     return false;
            //     // return analyticsEntry.userId === userId && analyticsEntry.createdAt.toISOString().slice(0, 10) != savedAnalytics.createdAt.toISOString().slice(0, 10);
            // });
            const match1 = restaurant.totalCustomersData.some(analyticsEntry => {
                return analyticsEntry.userId === userId &&
                       analyticsEntry.createdAt.toISOString().slice(0, 10) === savedAnalytics.createdAt.toISOString().slice(0, 10);
            });

            const match2 = restaurant.totalCustomersData.some(analyticsEntry => {
                return analyticsEntry.userId === userId ;
            });

            //if not present
            if (!match1 && match2) {
                restaurant.returningCustomerData.push(userId);
                restaurant.returningCustomer = restaurant.returningCustomerData.length;
                await restaurant.save();
            }
        }

        //total customers
        if (restaurant.totalCustomersData.length > 0) {
            // const existingAnalytics = await analytics.find({
            //     _id: { $in: restaurant.totalCustomersData }
            // });

            // const hasDuplicate = existingAnalytics.some(entry =>
            //     entry.userId.toString() === userId && entry.createdAt.toISOString().slice(0, 10) === savedAnalytics.createdAt.toISOString().slice(0, 10)
            // );

            const hasDuplicate = restaurant.totalCustomersData.some(entry =>
                entry.userId === userId &&
                entry.createdAt.toISOString().slice(0, 10) === savedAnalytics.createdAt.toISOString().slice(0, 10)
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


        //for customer Record
        const date1 = new Date();
        const restaurant1 = await restaurantDetails.findById(resId).populate('customerData').exec();
        const customerData = restaurant1.customerData;
        // const isUserIdPresent = customerData.some((customer) => customer.userId.toString() === userId);
        if(customerData.length > 0){
        const c = customerData.find((customer) => customer.userId.toString() === userId);

        if (c) {
            const customer = await customerRecord.findOne({_id:c._id});
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
            const newRecord = await customerRecord.create({ userId: userId, count: 1,createdAt : date1 });
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

        //for recommendation record

        const restaurant2 = await restaurantDetails.findById(resId);

        if (!restaurant2) {
            return res.status(404).send('Restaurant not found');
        }

        const Recrecord = await recommendationRecord.findOne({
            userId,
            menuId,
            menu: true,
        });

        if (Recrecord) {
            // If the rating is the same, delete the entry
            if (Recrecord.rated === rated) {
                await Recrecord.remove();
                // return res.status(200).send({ message: 'Rating deleted' });
            }
            // If the rating is different, update the entry
            else {
                Recrecord.rated = rated;
                Recrecord.createdAt = new Date();
                Recrecord.low = rated === 'notLiked';
                await Recrecord.save();
                // return res.status(200).send({ message: 'Rating updated' });
            }
        } else {
            // If no entry exists, create a new one
            const newRecommendationRecord = new recommendationRecord({
                userId,
                menuId,
                menu: true,
                rated: rated,
                low: rated === 'notLiked',
            });
            await newRecommendationRecord.save();

            const res = await restaurantDetails.findOneAndUpdate(
                { _id : resId },
                { $push: { recommendationRecord: newRecommendationRecord._id } },
                { new: true }
              );
            // return res.status(201).send({ message: 'Rating created' });
        }

        res.status(200).json({
            message: "Rating updated successfully",
        });

    } catch (error) {
        console.error("Error updating rating:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

module.exports = { updateRating };
