var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var moviesRouter = require('./routes/movies');
var ratingsRouter = require('./routes/ratings');
var tagsRouter = require('./routes/tags');
var totalRowsRouter = require('./routes/totalRows');
var genresRouter = require('./routes/genres');
var yearsRouter = require('./routes/years');
var movieRouter = require('./routes/movie');

var app = express();
var cors = require('cors')

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    for (var key in req.query){
        req.query[key.toLowerCase()] = req.query[key];
    }
    next();
});

app.use('/', indexRouter);
app.use('/movies', moviesRouter);
app.use('/ratings', ratingsRouter);
app.use('/tags', tagsRouter);
app.use('/totalRows', totalRowsRouter);
app.use('/genres', genresRouter);
app.use('/years', yearsRouter);
app.use('/movie', movieRouter);

module.exports = app;