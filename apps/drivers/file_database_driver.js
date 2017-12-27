var fs = require('fs');

const DataPath = "./data/";
const ConversationPath = DataPath+"conversations/";
const TagPath = DataPath+"tags/";

var FileDatabase,
    instance;

FileDatabase = function() {
    var self = this;

    /**
     * Fetch a file
     * @param {*} path 
     * @param {*} callback err, data
     */
    function readFile(path, callback) {
        console.log("Database.readFile",path);
        fs.readFile(path, function read(err, data) {
            var json;
            console.log("Database.readFile-1",err,data);
            if (data) {
                json = JSON.parse(data);
            }
            return callback(err, json);
        });
    };

    self.fetchConversation = function(conId, callback) {
        var path = ConversationPath+conId;
        readFile(path, function(err, data) {
            return callback(err, data);
        });
    };

    /**
     * 
     * @param {*} nodeId 
     * @param {*} callback err data
     */
    self.fetchNode = function(nodeId, callback) {
        var path = DataPath+nodeId;
        readFile(path, function(err, data) {
            console.log("Database.fetchNode",nodeId,data);
            return callback(err, data);
        });
    };

    /**
     * 
     * @param {*} id 
     * @param {*} callback err data
     */
    self.fetchTag = function(id, callback) {
        var path = TagPath+id;
        readFile(path, function(err, data) {
            console.log("Datatabase.fetchTag",id,data);
            return callback(err, data);
        });
    };

    /**
     * Save node data
     * @param id
     * @param {*} json 
     * @param {*} callback error or undefined
     */
    self.saveNodeData = function(id, json, callback) {
        console.log("DatabaseSaveNodeData",id, JSON.stringify(json));
        fs.writeFile(DataPath+id, 
                JSON.stringify(json), function(err) {
            return callback(err);
        }); 
    };

    /**
     * Save conversation data
     * @param {*} id 
     * @param {*} json 
     * @param {*} callback err
     */
    self.saveConversationData = function(id, json, callback) {
        console.log("DatabaseSaveConversationData",id, JSON.stringify(json));
        fs.writeFile(ConversationPath+id, 
                JSON.stringify(json), function(err) {
            return callback(err);
        }); 
    };

    self.saveTagData = function(id, json, callback) {
        console.log("DatabaseSaveTagData",id, JSON.stringify(json));
        fs.writeFile(TagPath+id, 
                JSON.stringify(json), function(err) {
            return callback(err);
        }); 
    };

    /**
     * List files in a directory
     * https://gist.github.com/kethinov/6658166
     * @param {*} dir 
     * @param {*} filelist 
     */
    var walkSync = function(dir, filelist) {
        var files = fs.readdirSync(dir);
        filelist = filelist || [];
        files.forEach(function(file) {
           filelist.push(file);
        });
        return filelist;
    };

    /**
     * @return does not return <code>null</code>
     */
    self.listConversations = function() {
        return walkSync(ConversationPath, []);
    };

    self.listTags = function() {
        return walkSync(TagPath, []);
    };
};
instance = new FileDatabase();
module.exports = instance;