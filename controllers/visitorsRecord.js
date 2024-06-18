const restaurantDetails = require('../models/restaurantDetails');
const visitorsRecord = require('../models/visitorsRecord');

const updateVisitorsData = async(req,res) => {
    try{
        const userId = req.params.userId;
        const restaurantId = req.params.restaurantId;

        const date1 = new Date();
        const restaurant = await restaurantDetails.findById(restaurantId).populate('visitorsRecord').exec();
        const visitorsData = restaurant.visitorsRecord;
        if (visitorsData.length > 0) {
            const c = visitorsData.find((customer) => customer.userId.toString() === userId);

            if (c) {
                const customer = await visitorsRecord.findOne({ _id: c._id });
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
                const newRecord = await visitorsRecord.create({ userId: userId, count: 1,createdAt : date1 });

                const res = await restaurantDetails.findOneAndUpdate(
                    { _id: restaurantId },
                    { $push: { customerData: newRecord._id } },
                    { new: true }
                );
            }
        }
        else {
            const newRecord = await visitorsRecord.create({ userId: userId, count: 1,createdAt : date1 });
            const res = await restaurantDetails.findOneAndUpdate(
                { _id: restaurantId },
                { $push: { visitorsRecord: newRecord._id } },
                { new: true }
            );
        }

        res.status(200).json({ message: "Visitors data updated" });
    }
    catch(error){
        console.error("Error in updating visitors data:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

const updateVisitorsCount = async(req,res) => {
    try{
        const restaurantId = req.params.restaurantId;
        const restaurant = await restaurantDetails.findById(restaurantId).exec();
        if (!restaurant) {
            return res.status(500).json({ error: "Restaurant details not found" });
        }
        restaurant.visitorsCount += 1;
        await restaurant.save();

        res.status(200).json({ message: "Visitors count updated" });


    } catch(error) {
        console.error("Error in updating visitors count:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

module.exports = {updateVisitorsData,updateVisitorsCount};