var express = require ('express');
var app = express();
require('events').EventEmitter.prototype._maxListeners = 100;
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
    console.log("request to: " + req.url);
    next();
});
app.get('/', function(req, res){
    res.send('<h1>hello word</h1>');
});
app.get('/profile/:name', function(req,res){
	res.status(200);
	res.type('json');
	res.send({
		name : req.params.name
	});
});

app.use(function(req, res, next){
   res.send("404 - Not Found"); 
});
app.listen(3000);
console.log("listening on 3000" );

