const mongoose =  require('mongoose');

const comments = new mongoose.Schema({
    description : {
        type: String,
        required: true,
    },
    // restaurantId : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref : "restaurantDetails",
    // },
    // menuItem : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref : "menuItem",
    // },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "userProfile",
    },
    rated : {
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const comment = mongoose.model("comments", comments);

module.exports = comment;