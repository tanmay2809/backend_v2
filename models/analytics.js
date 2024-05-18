const mongoose =  require('mongoose');

const analyticsSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userProfile",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const analytics = mongoose.model("analytics",analyticsSchema);

module.exports = analytics;