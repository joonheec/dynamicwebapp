var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Drop = new Schema({
  	post_title: {type: String, required: true},
  	slug: {type: String, required: true, unique: true},
  	brand: {type: String, required: true},
  	objectName: {type: String, required: true},
  	description: {type: String, required: false},
  	// tags: [String],
  	dateCreated: {type: Date, default: Date.now},
  	imageFileName: {type: String, required: true},
  	user_id: {type: String, require: true},
  	comments: {type: Array, require: false}
});

module.exports = mongoose.model('Drop', Drop);