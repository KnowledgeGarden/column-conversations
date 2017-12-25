var express = require('express');
var router = express.Router();

var ConversationModel = require('../apps/models/conversation_model');
var helper = require('./helper');


router.get("/newconversation", function(req, res, next) {
    console.log("New Conversation");
    return res.redirect("/");
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

router.post("/newconversation", function(req, rew, next) {

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