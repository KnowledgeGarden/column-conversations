var express = require('express');
var router = express.Router();
var helper = require('./helper');


/* GET home page. */
router.get('/', function(req, res, next) {
  return res.render('index', helper.startData());
});

module.exports = router;
