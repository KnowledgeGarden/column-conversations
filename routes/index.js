var express = require('express');
var router = express.Router();
var helper = require('./helper');
var constants = require('../apps/constants');
var EventModel = require('../apps/models/eventlog_model');


/* GET home page. */
router.get('/', helper.isPrivate, function(req, res, next) {
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
router.get('/fetch/:id/:type', helper.isPrivate,function(req, res, next) {
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
  } else if (type === constants.BLOG_NODE_TYPE) {
    return res.redirect('/journal/'+id);
  } else {
    return res.redirect('/conversation/'+id);
  }
  
});

router.get('/login', function(req, res, next) {
  var data = helper.startData(req);
  return res.render("login_form", data);
});

router.get("/aboutbookmarks", function(req, res, nex) {
  var data = helper.startData(req);
  return res.render("about_bookmarks", data);
});
router.get("/aboutconnections", function(req, res, nex) {
  var data = helper.startData(req);
  return res.render("about_connections", data);
});
router.get("/aboutjournals", function(req, res, nex) {
  var data = helper.startData(req);
  return res.render("about_journal", data);
});
router.get("/aboutconversations", function(req, res, nex) {
  var data = helper.startData(req);
  return res.render("about_conversations", data);
});
router.get("/abouttags", function(req, res, nex) {
  var data = helper.startData(req);
  return res.render("about_tags", data);
});
router.get("/aboutdbpedia", function(req, res, nex) {
  var data = helper.startData(req);
  return res.render("about_dbpedia", data);
});
router.get("/aboutcarrotsearch", function(req, res, nex) {
  var data = helper.startData(req);
  return res.render("about_carrotsearch", data);
});
router.get("/aboutgeomap", function(req, res, nex) {
  var data = helper.startData(req);
  return res.render("about_geomap", data);
});


router.post('/login', function(req, res, next) {
  var name = req.body.username,
      password = req.body.password;
  if (!helper.authenticate(name, password, req)) {
    req.flash("error", "Authentication failed");
    return res.redirect('/');
  } else {
    var struct = {};
    struct.type = constants.LOGIN_EVENT;
    struct.content = name;
    EventModel.registerSimpleEvent(struct, function(err) {
      return res.redirect('/');
    });
  }
//  console.log("LOGIN",name,req.session);
});
module.exports = router;
