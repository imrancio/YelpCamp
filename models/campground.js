var mongoose = require('mongoose');
//apply mongoose-regex-search plugin to mongoose
mongoose.plugin(require('mongoose-regex-search'));

// create schema for campground
var campgroundSchema = new mongoose.Schema({
    name: { type: String, index: true, searchable: true },
    price: { type: String, index: true, searchable: true },
    image: String,
    description: { type: String, index: true, searchable: true },
    location: { type: String, index: true, searchable: true },
    lat: Number,
    lng: Number,
    createdAt: { type: Date, default: Date.now() },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: { type: String, index: true, searchable: true }
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
