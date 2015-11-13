module.exports = function() {
	var express = require('express')
		, router = express.Router()
		;

	router.get('/', function(req, res) {
		return res.render('index', { title: 'Blog - React.js' });
	});

	router.get('/api/posts', function(req, res) {
		/*
		var data = [
			{ 
		    id: '123456'
		  , title: 'Post 01'
		  , content: 'Teste de post\nVários parágrafos'
		  , author: 'Marcelo da Sou'
		  , date: '01/01/2001'
		  }
			, { 
		    id: '123452'
		  , title: 'Post 02'
		  , content: 'Teste de post 02\nInline paragraph'
		  , author: 'Marcelo da Sou'
		  , date: '02/02/2001'
		  }
		]
		*/
		var db = req.db;
		var posts = db.get('posts');
		posts.find({}, { sort: { date: -1 } }, function(err, docs) {
			if(err) throw err;
			return res.send(docs);
		});
		
	});

	router.post('/api/post', function(req, res) {
		var db = req.db;
		var posts = db.get('posts');
		var post = {
			author: req.body.author
			, title: req.body.title
			, content: req.body.content
			, date: new Date()
		};
		posts.insert(post, function(err, doc) {
			if(err) throw err;
			return res.send(doc);
		});
	});

	router.post('/api/delete', function(req, res) {
		var db = req.db;
		var posts = db.get('posts');
		posts.remove({ _id: req.body._id }, function(err) {
			if(err) throw err;
			return res.send({ status: 1 });
		});
	});

	return router;
};