var ConversationModel = require('../apps/models/conversation_model');
var Helper,
    instance;

Helper = function() {
    var self = this;
    //console.log("HELPER");

    /**
     * Prefill a JSONObject with data for rendering
     * @return
     */
    self.startData = function() {
        var result = { title: 'ColCon' };
        var nd = ConversationModel.listConversations();
        //list conversations: 
        result.conlist = nd;
        return result;
    };
    

};
instance = new Helper();
module.exports = instance;