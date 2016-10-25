var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');

var uploadPath = path.join(__dirname, '../public/uploads');
var upload = multer({dest: uploadPath});

var Drop = require('../models/drop');

router.get('/', function(req, res) {
	// TODO get last 20 documents
	var q = Drop.find().sort('date').limit(10);
	q.exec(function(err, posts) {
		if (err) {
			console.log(err);
		}
		res.render('index', {
			posts: JSON.stringify(posts)
		});
	});
});

router.get('/enter', function(req, res) {
	res.render('enter');
});
router.get('/:id', function(req, res) {
	
	Drop.findOne({'_id': req.params.id}, function(err, data) {
		if (err) {
			console.log(err);
		}
		res.render('post', {
			data: JSON.stringify(data)
		});
	});
});
router.post('/enter', upload.single('image'), function(req, res, next) {
	console.log("here");
	var drop = new Drop({
		post_title: req.body.postTitle,
		slug: slugify(req.body.postTitle.split(' ')),
		brand: req.body.brand,
		name: req.body.name,
		description: req.body.description,
		dateCreated: new Date(),
		imageFileName: 'uploads/' + req.file.filename
	});

	drop.save(function(err, data) {
		if (err) {
			if (err.code == 11000) {
				// TODO
				// duplicate slug
			}
			console.log(err);
			res.status(500);
			return res.json({
				status: 'error',
				message: 'could not create drop',
				error: err
			});
		}
		res.redirect('/');
	});
});

function slugify(slug_list) {
	var slug = '';

	for (var i = 0; i < slug_list.length; i++) {
		var part = slug_list[i];

		if (part == '') {
			continue;
		}

		part = part.replace(/\W/g, '')
		part = part.toLowerCase();

		if (i == slug_list.length - 1) {
			slug += part;
		} else {
			slug += part + '-';
		}
  	}

  	if (slug[slug.length - 1] == '-') {
  		slug = slug.substring(0, slug.length - 1);
  	}

  	return slug;
}

module.exports = router;