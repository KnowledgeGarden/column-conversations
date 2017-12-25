var ConversationModel = require('../apps/models/conversation_model');
var Helper,
    instance;

Helper = function() {
    var self = this;
    console.log("HELPER");

    self.startData = function() {
        var result = { title: 'ColCon' };
        var nd = null;
        //TODO add list of conversations: 
        result.conList = nd;
        return result;
    };
    

};
instance = new Helper();
module.exports = instance;