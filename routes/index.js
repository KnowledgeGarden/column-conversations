var express = require('express');
var router = express.Router();
var helper = require('./helper');
var constants = require('../apps/constants');
var EventModel = require('../apps/models/eventlog_model');


/* GET home page. */
router.get('/', function(req, res, next) {
//  console.log("Home",req.session);
  EventModel.listRecentEvents(50, function(events) {
    var data = helper.startData(req);
    data.recentlist = events;    
    return res.render('index', data);
  });
});

/**
 * This turns out to be an important vehicle for fetching a node
 * when you only know its id and its type.
 */
router.get('/fetch/:id/:type', function(req, res, next) {
  var id = req.params.id,
      type = req.params.type;
  console.log("Index.fetch",id,req.body);
  if (type === constants.BOOKMARK_NODE_TYPE) {
    return res.redirect('/bookmark/'+id);
  } else if (type === constants.TAG_NODE_TYPE) {
    return res.redirect('/tags/gettag/'+id);
  } else if (type === constants.CONVERSATION_NODE_TYPE) {
    return res.redirect('/conversation/fetchconversation/'+id);
  } else if (type === constants.RELATION_NODE_TYPE) {
    return res.redirect('/connections/'+id);
  } else {
    return res.redirect('/conversation/'+id);
  }
  
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
