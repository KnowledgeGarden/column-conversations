var fs = require('fs');

const DataPath = "./data/";
const ConversationPath = DataPath+"conversations/";

var FileDatabase,
    instance;

FileDatabase = function() {
    var self = this;

    /**
     * Save node data
     * @param id
     * @param {*} json 
     * @param {*} callback error or undefined
     */
    self.saveNodeData = function(id, json, callback) {
        console.log("DatabaseSaveNodeData", JSON.stringify(json));
        fs.writeFile(DataPath+id+".json", 
                JSON.stringify(json), function(err) {
            return callback(err);
        }); 
    };

    /**
     * Save conversation data
     * @param {*} id 
     * @param {*} json 
     * @param {*} callback 
     */
    self.saveConversationData = function(id, json, callback) {
        console.log("DatabaseSaveConversationData", JSON.stringify(json));
        fs.writeFile(ConversationPath+id+".json", 
                JSON.stringify(json), function(err) {
            return callback(err);
        }); 
       
    }


};
instance = new FileDatabase();
module.exports = instance;