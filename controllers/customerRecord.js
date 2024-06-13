const restaurantDetails = require('../models/restaurantDetails');

const searchRecord = async (req, res) => {
    try {
        const { resId } = req.params;
        const searchParam = req.params.search;

        const record = await restaurantDetails.findById(resId).populate('customerData')
            .populate({
                path: 'customerData',
                populate: {
                    path: 'userId'
                }
            })
            .exec();
        
        const records = record.customerData;
        if (!records) {
            return res.status(404).json({ error: 'Record not found' });
        }

        const results = records.filter((record) => {
            const userName = record.userId?.name?.toLowerCase();
            const userMobileNumber = record.userId?.contact.toString();
            const searchParamLower = searchParam?.toLowerCase();
            return (
                (userName !== undefined && userName.includes(searchParamLower)) ||
                (userMobileNumber !== undefined && userMobileNumber.includes(searchParamLower))
              );
        });
        return res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error searching customer records' });
    }
}

module.exports = {searchRecord};