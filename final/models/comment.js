var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
	 text: {type: String, required: true},
	 dateCreated: {type: Date, default: Date.now},
	 user: {type: String, required: true}
});

module.exports = mongoose.model('Comment', Comment);