const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 200,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    },
    },
    {timeseries: true}
);

module.exports = mongoose.model("Post", PostSchema);