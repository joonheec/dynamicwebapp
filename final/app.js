// Joon Hee Choi | jhc577@nyu.edu

// ************
// Load Modules
// ************
var express = require('express');
var hbs = require ('hbs');
var fs = require('fs');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
require('dotenv').config();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL);


// **********
// Create App
// **********
var app = express();

app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(cookieParser(process.env.cookieSecret));

app.use(session({
    secret: process.env.sessionSecret,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      url: process.env.DB_URL
    })
  }
));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'hbs');
app.set('view options', { layout: 'layouts/main' });

var portNum = process.env.PORT || 8001;
app.set('port', portNum);
app.use(express.static('public'));

var auth = require('./lib/auth')(app);
auth.init(); // setup middleware
auth.registerRoutes();

var index = require('./routes/index');
app.use('/', index);


// *********
// Start App
// **********
app.listen(portNum, function(){
	console.log('listening on port ', portNum);
});