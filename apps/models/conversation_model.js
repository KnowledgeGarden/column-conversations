const DataPath = "../../data/";
var Database = require('../drivers/file_database_driver');
var uuid = require('uuid');
var Conversation,
    instance;

Conversation = function() {
    var self = this;

    // user UUIDs for Node IDs
    function newUUID() {
        return uuid.v4();
    };

    self.fetchView = function(viewId, callback) {
        console.log("Model fetching ",viewId);
        var data = require(DataPath+viewId+".json");
        return callback(data);
    };

    /**
     * 
     * @param {*} title 
     * @param {*} details 
     * @param {*} callback 
     */
    self.newConversation = function(title, details, callback) {
        var json = {},
            d = new Date();
            id = d.getTime();
        json.id = id;
        json.statement = title;
        json.details = details;
        Database.saveConversationData(id, json, function(err) {
            console.log("ModelNewConversation", title, err);            
            return callback(err);
        });
    };


};
instance = new Conversation();
module.exports = instance;