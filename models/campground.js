var mongoose = require('mongoose');

// create schema for campground
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
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
