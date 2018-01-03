var express = require('express');
var router = express.Router();
var helper = require('./helper');

router.get('/carrotsearch', function(req, res, next) {
    return res.render('carrotsearch', helper.startData(req));
});

module.exports = router;