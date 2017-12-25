var Conversation,
    instance;

Conversation = function() {
    var self = this;
console.log("ConversationModel");

    self.fetchView = function(viewId, callback) {
        console.log("Model fetching ",viewId);
        var data = require("../../data/"+viewId+".json");
        return callback(data);
    };


};
instance = new Conversation();
module.exports = instance;