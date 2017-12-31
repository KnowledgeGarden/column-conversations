var express = require('express');
var router = express.Router();
var helper = require('./helper');


/* GET home page. */
router.get('/', function(req, res, next) {
//  console.log("Home",req.session);
  return res.render('index', helper.startData(req));
});

router.get('/login', function(req, res, next) {
  var data = helper.startData(req);
  return res.render("login_form", data);
});

router.post('/login', function(req, res, next) {
  var name = req.body.username,
      password = req.body.password;
  if (!helper.authenticate(name, password, req)) {
    req.flash("error", "Authentication failed");
  }
//  console.log("LOGIN",name,req.session);
  return res.redirect('/');
});
module.exports = router;
