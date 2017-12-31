var fs = require('fs');
var constants = require('../constants');

/** Paths */
const DataPath = "./data/";
const ConversationPath = DataPath+"conversations/";
const BookmarkPath = DataPath+"bookmarks/";
const EventLogPath = DataPath+"eventlog/";
const RecentEventsPath = EventLogPath+"recentEvents.json";
const HistoryPath = EventLogPath+"history.json";
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
    function readFile(path) {
        console.log("Database.readFile",path);
        var json;
        try {
            var f = fs.readFileSync(path);
//          console.log("Database.readFile-1",f);
            if (f) {
//              console.log("Database.readFile-2",f);
                try {
                    json = JSON.parse(f);
//                  console.log("Database.readFile-3",json);
                } catch (e) {
                    console.log("Database.readFile error",path,e);
                }
            }
        } catch (x) {}
//        console.log("Database.readFile-4",json);
        return json;
    };

    /**
     * List files in a directory
     * https://gist.github.com/kethinov/6658166
     * @param {*} dir 
     * @param {*} filelist 
     */
    function walkSync(dir, filelist) {
        var files = fs.readdirSync(dir);
        filelist = filelist || [];
        files.forEach(function(file) {
           filelist.push(file);
        });
        return filelist;
    };

    ////////////////////////
    // Conversations
    ////////////////////////
    self.fetchConversation = function(conId, callback) {
        var path = ConversationPath+conId;
        var result = readFile(path);
        return callback(null, result);
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

    /**
     * @return does not return <code>null</code>
     */
    self.listConversations = function() {
        return walkSync(ConversationPath, []);
    };

    ////////////////////////
    // General purpose
    //  To INTERPRET any node which can be in a conversation
    ////////////////////////

    self.fetchData = function(nodeId, callback) {
        //assume it's a conversation
        self.fetchNode(nodeId, function(err, data) {
            if (data) {
                return callback(err, data);
            }
            // fall through to Bookmarks
            self.fetchBookmark(nodeId, function(err1, data1) {
                return callback(err1, data1);
            });
        });
    };

    /** do not need this 
    self.saveData = function(nodeId,json, callback) {
        var type = json.type;
        if (type === constants.BOOKMARK_NODE_TYPE) {
            self.saveBookmarkData(nodeId, json, function(err) {
                return callback(err);
            });
        } //TODO ADD OTHER TYPES, e.g. Blog, etc
        // fall through
        self.saveNodeData(nodeId, json, function(err) {
            return callback(err);
        });
    };**/
    ////////////////////////
    // Conversation Nodes
    ////////////////////////

    /**
     * 
     * @param {*} nodeId 
     * @param {*} callback err data
     */
    self.fetchNode = function(nodeId, callback) {
        var path = DataPath+nodeId;
        var result = readFile(path);
        return callback(null, result);
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

    ////////////////////////
    // Tags
    ////////////////////////

    /**
     * 
     * @param {*} id 
     * @param {*} callback err data
     */
    self.fetchTag = function(id, callback) {
        var path = TagPath+id;
        var result = readFile(path);
        return callback(null, result);
    };

    self.saveTagData = function(id, json, callback) {
        console.log("DatabaseSaveTagData",id, JSON.stringify(json));
        fs.writeFile(TagPath+id, 
                JSON.stringify(json), function(err) {
            return callback(err);
        }); 
    };

    self.listTags = function() {
        return walkSync(TagPath, []);
    };

    ////////////////////////
    // Bookmarks
    ////////////////////////

    self.fetchBookmark = function(id, callback) {
        var path = BookmarkPath+id;
        var result = readFile(path);
        return callback(null, result);
    };

    self.saveBookmarkData = function(id, json, callback) {
        console.log("DatabaseSaveBookmarkData",id,json);
        fs.writeFile(BookmarkPath+id, 
                JSON.stringify(json), function(err) {
            return callback(err);
        }); 
    };

    self.listBookmarks = function() {
        return walkSync(BookmarkPath, []);
    };

    ////////////////////////
    // Events
    ////////////////////////


};
instance = new FileDatabase();
module.exports = instance;