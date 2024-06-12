const restaurantDetails = require('../models/restaurantDetails');
const userProfile = require('../models/userProfile');
const analytics = require('../models/analytics');
const customerRecord = require('../models/customerRecord');
const recommendationRecord = require('../models/recommendationRecord');

const toggleRecommendation = async (req, res) => {
    try {
        const userId = req.params.userId;
        const restaurantId = req.params.restaurantId;

        const restaurant = await restaurantDetails.findById(restaurantId);

        const indexInRecommendations = restaurant.recommendedBy.indexOf(userId);
        if (indexInRecommendations !== -1) {
            restaurant.recommendedBy.splice(indexInRecommendations, 1);
        } else {
            restaurant.recommendedBy.push(userId);
        }

        const count = restaurant.recommendedBy.length;

        restaurant.recommendationCount = count;

        await restaurant.save();

        const user = await userProfile.findById(userId);

        const indexInUserRecommendations = user.recommendedRestaurants.indexOf(restaurantId);
        if (indexInUserRecommendations !== -1) {
            user.recommendedRestaurants.splice(indexInUserRecommendations, 1);
        } else {
            user.recommendedRestaurants.push(restaurantId);
        }

        await user.save();


        //for total and returning customer
        const analytic = new analytics({
            userId,
        });

        const savedAnalytics = await analytic.save();

        const rest = await restaurantDetails.findById(restaurantId).populate('totalCustomersData').exec();
        if (!rest) {
            return res.status(500).json({ error: "Restaurant details not found" });
        }

        //total returning
        if (!Array.isArray(rest.returningCustomerData)) {
            rest.returningCustomerData = [];
        }

        const x = rest.returningCustomerData.includes(userId);
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
            const match1 = rest.totalCustomersData.some(analyticsEntry => {
                return analyticsEntry.userId === userId &&
                    analyticsEntry.createdAt.toISOString().slice(0, 10) === savedAnalytics.createdAt.toISOString().slice(0, 10);
            });
            const match2 = rest.totalCustomersData.some(analyticsEntry => {
                return analyticsEntry.userId === userId;
            });

            //if not present
            if (!match1 && match2) {
                rest.returningCustomerData.push(userId);
                rest.returningCustomer = restaurant.returningCustomerData.length;
                await rest.save();
            }
        }
        //total customer 
        if (rest.totalCustomers > 0) {
            // const existingAnalytics = await analytics.find({
            //     _id: { $in: rest.totalCustomersData }
            // });

            // const hasDuplicate = existingAnalytics.some(entry =>
            //     entry.userId.toString() === userId && entry.createdAt.toISOString().slice(0, 10) === savedAnalytics.createdAt.toISOString().slice(0, 10)
            // );

            const hasDuplicate = rest.totalCustomersData.some(entry => {
                return entry.userId === userId &&
                    entry.createdAt.toISOString().slice(0, 10) === savedAnalytics.createdAt.toISOString().slice(0, 10);
            });

            if (!hasDuplicate) {
                rest.totalCustomersData.push(savedAnalytics._id);
                rest.totalCustomers = rest.totalCustomersData.length;
                await rest.save();
            }
        }
        else {
            rest.totalCustomersData.push(savedAnalytics._id);
            rest.totalCustomers = rest.totalCustomersData.length;
            await rest.save();
        }

        //for customer Record
        const date1 = new Date();
        const restaurant1 = await restaurantDetails.findById(restaurantId).populate('customerData').exec();
        const customerData = restaurant1.customerData;
        if (customerData.length > 0) {
            const c = customerData.find((customer) => customer.userId.toString() === userId);
            // const isUserIdPresent = customerData.some((customer) => customer.userId.toString() === userId);

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
                const newRecord = await customerRecord.create({ userId: userId, count: 1,createdAt : date1 });

                const res = await restaurantDetails.findOneAndUpdate(
                    { _id: restaurantId },
                    { $push: { customerData: newRecord._id } },
                    { new: true }
                );
            }
        }
        else {
            const res = await restaurantDetails.findOneAndUpdate(
                { _id: restaurantId },
                { $push: { customerData: newRecord._id } },
                { new: true }
            );
        }

        //for recommendation record
        const restaurant2 = await restaurantDetails.findById(restaurantId).populate('recommendationRecord').exec();

        if (!restaurant2) {
            return res.status(404).send('Restaurant not found');
        }

        const existingRecommendation = restaurant2.recommendationRecord.find(record => record.userId.toString() === userId);

        if (existingRecommendation) {
            // Remove the existing recommendation
            await recommendationRecord.findByIdAndDelete(existingRecommendation._id);
            restaurant2.recommendationRecord = restaurant2.recommendationRecord.filter(record => record._id.toString() !== existingRecommendation._id.toString());
        } else {
            // Create a new recommendation
            const newRecommendation = new recommendationRecord({ userId });
            await newRecommendation.save();
            const res = await restaurantDetails.findOneAndUpdate(
                { _id: restaurantId },
                { $push: { recommendationRecord: newRecommendation._id } },
                { new: true }
            );
        }

        // await restaurant.save();

        res.status(200).json({ message: "Recommendation toggled successfully" });

    } catch (error) {
        console.error("Error toggling recommendation:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

module.exports = { toggleRecommendation };
