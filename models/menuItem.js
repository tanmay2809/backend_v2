const mongoose = require('mongoose');

const menuItem = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    image : {
        type: String,
    },
    description: {
        type : String,
    },
    price : {
        type:String,
        required : true,
    },
    veg : {
        type: String,
        required : true,
    },
    category: {
        type : String,
        required:true,
    },
    active  : {
        type: Boolean,
        default : true,
    },
    mustTry : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userProfile",
        }
    ],
    liked : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userProfile",
        }
    ],
    notLiked : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userProfile",
        }
    ],
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comments",
        }
    ],
    rated: {
        type:Number,
        default : 0,
    },
    mustTryCount : {
        type:Number,
        default : 0,
    },
    likedCount : {
        type:Number,
        default : 0,
    },
    notLikedCount : {
        type:Number,
        default : 0,
    }
});

const menu = mongoose.model("menuItem", menuItem);

module.exports = menu;
