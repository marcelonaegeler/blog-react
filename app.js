var express = require('express')
	, app = express()
	, swig = require('swig')
	, bodyParser = require('body-parser')
	, monk = require('monk')('localhost:27017/blog-react')
	;

app.engine('html', swig.renderFile);
app.set('views', __dirname +'/views');
app.set('view engine', 'html');
app.set('view cache', false);
app.use(express.static(__dirname +'/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set the DB global for requests
app.use(function(req, res, next) {
	req.db = monk;
	next();
});

app.use('/', require('./routes/blog')());

app.use(function(req, res, next) {
  return res.render('notFound');
});

app.listen(3000, function() {
	console.log('Magic happens on port 3000');
});