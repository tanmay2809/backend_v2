const comments = require('../models/comments');
const menuItem = require('../models/menuItem');

const addComment = async (req, res) => {
    try {
        const { description, rated } = req.body;
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

        res.status(201).json({ 
            message: "Comment added successfully",
            comment: savedComment 
        });
        
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

module.exports = { addComment };