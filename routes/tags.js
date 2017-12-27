var express = require('express');
var router = express.Router();
var constants = require('../apps/constants');
var helper = require('./helper');
var TagModel = require('../apps/models/tag_model');

router.get("/tagindex", function(req, res, next) {
    var data = helper.startData();
    data.taglist = TabModel.listTags();
    res.render('tag_index', data);
});

router.get("/newtag/:id", function(req, res, next) {
    var data = helper.startData(),
        id = req.params.id;
    console.log("NewTag",id);
    data.hidden_1 = id;
    data.hidden_2 = constants.TAG_NODE_TYPE;
    data.formtitle = "New Tag Node";
    data.action = "/tags/newnode"
   return res.render('newnode_form', data);
});

router.get("/gettag/:id", function(req, res, next) {
    var id = req.params.id,
        data = helper.startData();
    console.log("TAGGET",id);
    TagModel.fetchTag(id, function(err, result) {
        data.result = result;
        return res.render('tag_view', data);
    });
});

router.post("/newnode", function(req, res, next) {
    var title = req.body.title
        details = req.body.details,
        parentId = req.body.hidden_1,
        type = req.body.hidden_2,
        creatorId = constants.TEST_CREATOR; //TODO
    console.log("NT", JSON.stringify(req.body));
    TagModel.newTag(creatorId, title, parentId, function(err) {
        return res.redirect('/conversation/'+parentId)        
    });
});



module.exports = router;