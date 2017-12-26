var express = require('express');
var router = express.Router();
var constants = require('../apps/constants');
var ConversationModel = require('../apps/models/conversation_model');
var helper = require('./helper');


router.get("/newconversation", function(req, res, next) {
    console.log("New Conversation");
    var data = helper.startData();
    data.action = "/conversation/newconversation/";
    data.labelplaceholder = "Enter this conversation's label";
    data.detailsplaceholder = "Enter a description of this conversation";
    data.formtitle = "New Conversation";
    return res.render("newconversation_form", data);
});

/**
 * This is a special function: when you create a new conversation
 * it does not have a root node. If it has a root node, paint
 * that like any other node; otherwise, open a form to create
 * the conversation's root node.
 * TODO consider adding root node forms on the newconversation_form
 * The core issue is that when you fetch a conversation, that's not
 * what you render; rather you render its "rootnode"
 * This is typically called from the sidebar
 */
router.get("/fetchconversation/:id", function(req, res, next) {

});

router.get("/newquestion/:id", function(req, res, next) {
    var data = helper.startData(),
    id = req.params.id;
    console.log("NewQuestion ",id);
    //TODO
    return res.redirect("/conversation/"+id);
});
router.get("/newanswer/:id", function(req, res, next) {
    
});
router.get("/newpro/:id", function(req, res, next) {
    
});
router.get("/newcon/:id", function(req, res, next) {
    
});
                    
router.get("/:id", function(req, res, next) {
    var data = helper.startData(),
        id = req.params.id;
    console.log("Fetching ",id);
    ConversationModel.fetchView(id, function(result) {
        console.log("Model returned "+result);
        data.result = result;
        return res.render('view', data);
    });
    
});

router.post("/newconversation", function(req, res, next) {
    var title = req.body.title
        details = req.body.details;
    console.log("PostNewCon"+title);
    ConversationModel.newConversation(title, details, function(rslt) {
        return res.redirect("/");
    });
});

router.post("/newquestion", function(req, res, next) {
    
});

router.post("/newanswer", function(req, res, next) {
    
});

router.post("/newpro", function(req, res, next) {
    
});

router.post("/conversation/newcon", function(req, res, next) {
    
});
    

module.exports = router;