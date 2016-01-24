var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var mypipefs = req.mypipefs;
  res.render('index', { /*title: mypipefs.path*/ });
});

module.exports = router;
