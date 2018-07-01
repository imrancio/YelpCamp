var mongoose = require('mongoose');

// create schema for campground
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            // array of Comment model Object ids
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});
// compile schema for Campground model and export when 'require'
module.exports = mongoose.model('Campground', campgroundSchema);
