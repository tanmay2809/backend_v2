const category = require('../models/category');
const restaurantDetails = require('../models/restaurantDetails');

const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const id = req.params.id;

        const newCategory = new category({
            name: name,
        });

        const savedCategory  = await newCategory.save();

        const updatedDetails = await restaurantDetails.findByIdAndUpdate(
            id,
            { $push: { category: savedCategory._id } },
            { new: true } 
        );

        res.status(201).json({ 
            message: "Category added successfully",
            updatedDetails : updatedDetails,
            category : savedCategory,
        });

    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const {categoryId} = req.body;
        const id = req.params.id;

        const deletedCategory = await category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        const details = await restaurantDetails.findById(id);

        const index = details.category.indexOf(categoryId);
        if (index !== -1) {
            details.category.splice(index, 1);
            await details.save();
        }

        res.status(200).json({ 
            message: "Category deleted successfully",
            deletedCategory 
        });

    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

const toggleActiveStatusById = async(req,res) => {
    try{
        const {categoryId} = req.body;

        const foundCategory = await category.findById(categoryId);

        if (!foundCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        foundCategory.active = !foundCategory.active;

        await foundCategory.save();

        res.status(200).json({
             message: "Category active status toggled successfully",
              updatedCategory: foundCategory 
        });

    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

const getCategory = async(req,res) => {
    try{
        const id = req.params.id;

        const categories = await restaurantDetails.findById(id).populate('category');

        res.status(200).json({ 
            categories 
        });
    }
    catch(error){
        console.error("Error getting category:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
}

module.exports = { getCategory,addCategory,deleteCategory,toggleActiveStatusById };