const mongoose =  require('mongoose');

const customerRecordSchema = new mongoose.Schema({
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

const customerRecord = mongoose.model("customerRecord",customerRecordSchema);

module.exports = customerRecord;