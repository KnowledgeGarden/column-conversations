var express = require('express');
var router = express.Router();
var constants = require('../apps/constants');
var ConversationModel = require('../apps/models/conversation_model');
var helper = require('./helper');

function typeToLargeImage(type) {
    var result = "/images/ibis/map.png"; // default
    if (type === constants.QUESTION_NODE_TYPE) {
        result = "/images/ibis/issue.png";
    } else if (type === constants.ANSWER_NODE_TYPE) {
        result = "/images/ibis/position.png";
    } else if (type === constants.PRO_NODE_TYPE) {
        result = "/images/ibis/plus.png";
    } else if (type === constants.CON_NODE_TYPE) {
        result = "/images/ibis/minus.png";
    } else if (type === constants.NOTE_NODE_TYPE) {
        result = "/images/ibis/note.png";
    } else if (type === constants.REFERENCE_NODE_TYPE) {
        result = "/images/ibis/reference.png";
    } else if (type === constants.DECISION_NODE_TYPE) {
        result = "/images/ibis/decision.png";
    } else if (type === constants.TAG_NODE_TYPE) {
        result = "/images/tag.png";
    }

    return result;
}

router.get("/newconversation", function(req, res, next) {
    console.log("New Conversation");
    var data = helper.startData();
    return res.render("newconversation_form", data);
});

router.get("/fetchconversation/:id", function(req, res, next) {
    var data = helper.startData(),
        id = req.params.id;
    console.log("FetchingCon",id);
    ConversationModel.fetchConversation(id, function(result) {
        console.log("Model returned "+result);
        data.result = result;
        data.img = "/images/ibis/map.png";
        data.rootimg = typeToLargeImage(result.rootNode.type);
        data.rootnode = result.rootNode;
        return res.render('view_conversation', data);
    });
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


 // Creates a new conversation node as well as its root node
router.post("/newconversation", function(req, res, next) {
    console.log("XXXX",JSON.stringify(req.body));
    var title = req.body.title
        details = req.body.details,
        type = req.body.hidden_1,
        roottitle = req.body.roottitle,
        rootdetails = req.body.rootdetails;
    console.log("PostNewCon", type,title,details,  roottitle, rootdetails);
    ConversationModel.newConversation(title, details, type, roottitle, rootdetails, function(rslt) {
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