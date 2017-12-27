var express = require('express');
var router = express.Router();
var constants = require('../apps/constants');
var helper = require('./helper');
var TagModel = require('../apps/models/tag_model');

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

router.post("/newnode", function(req, res, next) {
    var title = req.body.title
        details = req.body.details,
        parentId = req.body.hidden_1,
        type = req.body.hidden_2;
    //TODO
    console.log("NT", JSON.stringify(req.body));
    res.redirect(parentId)
    
});

module.exports = router;