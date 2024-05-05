const mongoose = require("mongoose");

const category = new mongoose.Schema({
    name : {
       type:String, 
    },
    menuItems : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "menuItem",
    }],
    active : {
        type: Boolean,
        default : true,
    }
});

const menuCategory = mongoose.model("category", category);

module.exports = menuCategory;