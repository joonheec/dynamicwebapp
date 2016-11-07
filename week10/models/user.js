var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    role: String, //For Authorization (User or Admin)
    
});

//plugin adds Username, has and salt for password
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);