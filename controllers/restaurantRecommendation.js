const restaurantDetails = require('../models/restaurantDetails');
const userProfile =  require('../models/userProfile');

const toggleRecommendation =  async(req,res) => {
    try{
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

        res.status(200).json({ message: "Recommendation toggled successfully" });

    } catch(error) {
        console.error("Error toggling recommendation:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

module.exports = {toggleRecommendation};