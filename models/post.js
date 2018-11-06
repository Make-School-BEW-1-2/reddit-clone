const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    }
});

PostSchema.pre('save', function(next) => {
    const now = new Date();
    this.updatedAt = now;

    next();
})

module.exports = mongoose.model("Post", PostSchema);
