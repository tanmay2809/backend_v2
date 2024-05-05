const mongoose =  require('mongoose');

const blogsSchema = new mongoose.Schema({
    header : {
        type: String,
    },
    body : {
        type:String,
    },
    image : {
        type : String,
    },
    link : {
        type : String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const blogs = mongoose.model("blog", blogsSchema);

module.exports = blogs;