var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const port = 3001;

var indexRouter = require('./routes/index');
var quotesRouter = require('./routes/movies');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/movies', quotesRouter);

// app.listen(port, () => {
//     console.log(`Express running on port ${port}.`);
// });

module.exports = app;