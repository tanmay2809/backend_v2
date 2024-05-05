const blogs = require("../models/blogs");

const addBlog = async (req, res) => {
    try {
        const { header, body, image, link } = req.body;

        const newBlog = await blogs.create({
            header,
            body,
            image,
            link,
        });

        res.status(201).json({
            success: true,
            data: newBlog,
            message: "Blog added successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to add blog",
            error: err.message,
        });
    }
};

const getBlog = async (req, res) => {
    try {

        const allblog = await blogs.find();

        res.status(200).json({
            success: true,
            data: allblog,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            data: "failed to fetch blogs",
            message: err.message,
        });
    }
};

const getBlogById = async (req, res) => {
    try {
        // Extract the last four digits of the ID from the request parameters
        const { id } = req.params;
        // const blog = await blogs.findOne({
        //     _id: { $regex: new RegExp(`${id}$`, 'i') }
        // });


        const blog1 = await blogs.find();

        // Find the blog with the matching last four characters in its _id
        const blog = blog1.find(blog => blog._id.toString().endsWith(id));

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to get blog",
            error: err.message,
        });
    }
};

const editBlog = async (req, res) => {
    try {
        const {id} = req.params;
        const { header, body, image, link } = req.body;

        // Find the blog by ID and update it
        const updatedBlog = await blogs.findByIdAndUpdate(id, {
            header,
            body,
            image,
            link,
        }, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update blog",
            error: err.message,
        });
    }
};


const deleteBlog = async (req, res) => {
    try {
        // Extract the blog ID from the request parameters
        const { id } = req.params;

        // Find the blog by ID and delete it
        const deletedBlog = await blogs.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            data: deletedBlog,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to delete blog",
            error: err.message,
        });
    }
};

module.exports = { addBlog, editBlog, getBlog, deleteBlog, getBlogById };