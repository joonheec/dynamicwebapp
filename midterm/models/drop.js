var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dropSchema = new Schema({
  	post_title: {type: String, required: true},
  	slug: {type: String, required: true, unique: true},
  	brand: {type: String, required: true},
  	name: {type: String, required: true},
  	description: {type: String, required: false},
  	tags: [String],
  	dateCreated: {type: Date, default: Date.now},
  	imageFileName: {type: String, required: true}
});

var Drop = mongoose.model('Drop', dropSchema);

// when we require this file, we get Drop model
module.exports = Drop;