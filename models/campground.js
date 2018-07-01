var mongoose = require('mongoose');

// create schema for campground
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
// compile schema for Campground model and export when 'require'
module.exports = mongoose.model('Campground', campgroundSchema);
