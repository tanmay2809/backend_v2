const mongoose =  require('mongoose');

const visitorsRecordSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userProfile",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    count : {
        type:Number,
    }
});

const visitorsRecord = mongoose.model("visitorsRecord",visitorsRecordSchema);

module.exports = visitorsRecord;