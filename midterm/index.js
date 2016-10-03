var express = require('express');
var hbs = require ('hbs');
var http = require("http");
var fs= require('fs');
// var SC = require('soundcloud');



// SC.initialize({
//   client_id: 'be813737621dc03984e53b44bc8b8ae7'
// });
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartial('partials', fs.readFileSync(__dirname + '/views/partials/partials.hbs', 'utf8'));
hbs.registerPartial('search', fs.readFileSync(__dirname + '/views/partials/search.hbs', 'utf8'));
hbs.registerPartial('footer', fs.readFileSync(__dirname + '/views/partials/footer.hbs', 'utf8'));


var app = express();
var portNum = process.env.PORT || 8888;
app.set('port', portNum);
app.use(express.static('public'));

// tell express to use handlebars
// app.engine('handlebars', hbs({defaultLayout:'main'}) );
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layouts/main' });




app.get('/:name',function(req,res){
	res.render('home', {
		name: req.params.name,
	});
})
//start server  
app.listen(portNum, function(){
	console.log('listening on port ', portNum);
})

var data = {

}