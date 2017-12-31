//var ConversationModel = require('../apps/models/conversation_model');
var config = require('../config/config');
var Helper,
    instance;

Helper = function() {
    var self = this;
    //console.log("HELPER");

    /**
     * Prefill a JSONObject with data for rendering
     * @return
     */
    self.startData = function(req) {
//        console.log("Helper.startData",req.session);
        var title = 'Column Conversation Testbed'; //TODO move to config.json
        var result = { title: title };
        if (req.flash) {
            result.flashMsg = req.flash("error") || req.flash("success");
        }
        if (self.isAuthenticated(req)) {
            result.isAuthenticated = true;
        }
        //current conversation
        result.curCon = req.session.curCon;
//        console.log("XYZ-2",req.session.curCon,req.session.theUser);
        return result;
    };
    
    self.isAuthenticated = function(req) {
//        console.log("Helper.isAuthenticated",req.session);
        if (req.session.theUser) {
            return true;
        }
        return false;
    };

    /**
     * Very simple authentication:
     * compare submitted credentials to what's in config.json
     */
    self.authenticate = function(handle, password, req) {
        if (password === config.secretPassword) {
            var i = config.validHandles.indexOf(handle);
            if (i > -1) {
                req.session.theUser = handle;
//                console.log("Authenticate",req.session);
                return true;
            }
        }
        return false;
    };

};
instance = new Helper();
module.exports = instance;