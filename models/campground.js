var mongoose = require('mongoose');
//apply mongoose-regex-search plugin to mongoose
mongoose.plugin(require('mongoose-regex-search'));

// create schema for campground
var campgroundSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now() },
    name: { type: String, index: true, searchable: true },
    price: { type: String, index: true, searchable: true },
    image: String,
    imageId: { type: String, default: null },
    description: { type: String, index: true, searchable: true },
    location: { type: String, index: true, searchable: true },
    lat: Number,
    lng: Number,
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
