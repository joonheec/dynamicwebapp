var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');

var uploadPath = path.join(__dirname, '../public/uploads');
var upload = multer({dest: uploadPath});

var User = require('../models/user');
var Drop = require('../models/drop');
var Comment = require('../models/comment');

router.get('/', function(req, res) {
	var q = Drop.find().sort('date').limit(20);
	q.exec(function(err, posts) {
		if (err) {
			console.log(err);
			if (req.user) {
				res.render('index', {
					posts: [],
					user_link: req.user._id,
					user_name : req.user.username
				});
			} else {
				res.render('index', {
					posts: []
				});
			}
		}

		if (req.user) {
			res.render('index', {
				posts: JSON.stringify(posts),
				user_link: req.user._id
			});
		} else {
			res.render('index', {
				posts: JSON.stringify(posts)
			});
		}
	});
});

router.get('/enter', function(req, res) {
	if(req.user){
		res.render('enter');
	}
	else{
		res.redirect('/');
	}
});

router.post('/enter', upload.single('image'), function(req, res, next) {
	var drop = new Drop({
		post_title: req.body.postTitle,
		slug: slugify(req.body.postTitle.split(' ')),
		brand: req.body.brand,
		objectName: req.body.name,
		description: req.body.description,
		dateCreated: new Date(),
		imageFileName: 'uploads/' + req.file.filename
	});

	drop.save(function(err, drop_data) {
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

		User.findOne({'_id': req.user}, function(err, user_data) {
			if (err) {
				return console.log(err);
			}

			user_data.drops.push(drop_data);
			user_data.save(function(err) {
				if (err) {
					return console.log(err);
				}

				res.redirect('/');
			});
		});
	});
});

router.get('/:id', function(req, res) {
	Drop.findOne({'_id': req.params.id}, function(err, data) {
		if (err) {
			console.log(err);
		}
		if (req.user) {
			res.render('drop', {
				data: JSON.stringify(data),
				enter_comment: true,
				comments: JSON.stringify(data.comments)
			});
		} else {
			res.render('drop', {
				data: JSON.stringify(data),
				enter_comment: false,
				comments: JSON.stringify(data.comments)
			});
		}
	});
});

router.post('/:id', function(req, res) {
	Drop.findOne({'_id': req.params.id}, function(err, data) {
		if (err) {
			return console.log(err);
		}
		if (req.user) {
			var comment = new Comment({
				text: req.body.comment,
				dateCreated: new Date(),
				user: req.user.username
			});

			comment.save(function(err, comment_data) {
				if (err) {
					return console.log(err);
				}

				User.findOne({'_id': req.user}, function(err, user_data) {
					if (err) {
						return console.log(err);
					}

					user_data.comments.push(comment_data);
					user_data.save(function(err) {
						if (err) {
							return console.log(err);
						}

						data.comments.push(comment_data);
						data.save(function(err, updated_drop_data) {
							if (err) {
								return console.log(err);
							}

							Comment.find({
								'_id': { $in: updated_drop_data.comments}
							}, function(err, comments) {
								if (err) {
									return console.log(err);
								}			

								res.render('drop', {
									data: JSON.stringify(data),
									enter_comment: true,
									comments: JSON.stringify(comments)
								});
							});
						});
					});
				});
			});
		} else {
			res.render('drop', {
				data: JSON.stringify(data),
				enter_comment: false,
				comments: JSON.stringify(data.comments)
			});
		}
	});
});

router.get('/user/:id', function(req, res) {
	User.findOne({'_id': req.user}, function(err, data) {
		if (err) {
			return console.log(err);
		}

		Comment.find({
			'_id': { $in: data.comments}
		}, function(err, comments) {
			if (err) {
				return console.log(err);
			}			
			Drop.find({
				'_id':{$in: data.drops}
			},function(err, drops) {
				if (err) {
					return console.log(err);
				}

				res.render('user', {
					comments: JSON.stringify(comments),
					drops: JSON.stringify(drops)
				});
			});
			
		});

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