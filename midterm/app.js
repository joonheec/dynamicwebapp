// Joon Hee Choi | jhc577@nyu.edu
// Midterm

var express = require('express');
var hbs = require ('hbs');
var fs= require('fs');
var bodyParser = require('body-parser');

var Mongoose = require('mongoose');
require('dotenv').config();
Mongoose.Promise = global.Promise;
Mongoose.connect(process.env.DB_URL);

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'hbs');
app.set('view options', { layout: 'layouts/main' });
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartial('partials', fs.readFileSync(__dirname + '/views/partials/partials.hbs', 'utf8'));
hbs.registerPartial('search', fs.readFileSync(__dirname + '/views/partials/search.hbs', 'utf8'));
hbs.registerPartial('footer', fs.readFileSync(__dirname + '/views/partials/footer.hbs', 'utf8'));

var portNum = process.env.PORT || 8000;
app.set('port', portNum);
app.use(express.static('public'));

var index = require('./routes/index');
app.use('/', index);

app.listen(portNum, function(){
	console.log('listening on port ', portNum);
});