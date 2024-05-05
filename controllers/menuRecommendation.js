const menuItem = require('../models/menuItem');

const updateRating = async (req, res) => {
    try {
        const { rated } = req.body;
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

        // menu.rated = (menu.mustTryCount + menu.likedCount)/2;

        const averageRating = Math.round((menu.mustTryCount + menu.likedCount) / 2);

        menu.rated = averageRating;
        
        await menu.save();

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
