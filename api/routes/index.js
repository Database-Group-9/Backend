var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("API is working my dude");
  //res.render('index', { title: 'Hello!' });
});

module.exports = router;
