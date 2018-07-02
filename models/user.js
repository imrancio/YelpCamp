var mongoose              = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: {type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'},
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: {type: Boolean, default: false}
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
