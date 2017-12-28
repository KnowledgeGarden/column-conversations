var ConversationModel = require('../apps/models/conversation_model');
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
        var result = { title: 'ColCon' };
        if (req.flash) {
            result.flashMsg = req.flash("error") || req.flash("success");
        }
        if (self.isAuthenticated(req)) {
            result.isAuthenticated = true;
        }
        var nd = ConversationModel.listConversations();
        //list conversations: 
        result.conlist = nd;
        //current conversation
        result.curCon = req.session.curCon;
        return result;
    };
    
    self.isAuthenticated = function(req) {
        if (req.session.theUser) {
            return true;
        }
        return false;
    };

    self.authenticate = function(handle, password, req) {
        if (password === config.secretPassword) {
            var i = config.validHandles.indexOf(handle);
            if (i > -1) {
                req.session.theUser = handle;
                return true;
            }
        }
        return false;
    };

};
instance = new Helper();
module.exports = instance;