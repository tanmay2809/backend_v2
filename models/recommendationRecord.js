const mongoose =  require('mongoose');

const recommendationRecordSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userProfile",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    low:{
        type:Boolean,
        default : false,
    },
    menu:{
        type:Boolean,
        default : false,
    },
    menuId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "menuItem",
    },
    rated:{
        type : String,
    }
});

const recommendationRecord = mongoose.model("recommendationRecord",recommendationRecordSchema);

module.exports = recommendationRecord;