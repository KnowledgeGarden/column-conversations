const DataPath = "../../data/";
const ConversationPath = DataPath+"conversations/";
var Database = require('../drivers/file_database_driver');
var uuid = require('uuid');
var constants = require('../constants');
var Conversation,
    instance;

Conversation = function() {
    var self = this;

    // user UUIDs for Node IDs
    // TODO not used
    function newUUID() {
        return uuid.v4();
    };

    /**
     * Some potential for collision
     * @return
     */
    function newId() {
        var d = new Date();
        return d.getTime().toString();
    }

    /**
     * Fetch a node
     * @param {*} viewId 
     * @param {*} callback err json
     */
    self.fetchView = function(viewId, callback) {
        console.log("Model fetching node",viewId);
        Database.fetchNode(viewId, function(err, data) {
            return callback(err, data);            
        });
    };

    /**
     * Fetch a conversation
     * @param {*} conId 
     * @param {*} callback json
     */
    self.fetchConversation = function(conId, callback) {
        console.log("Model fetching conversation",conId);
        Database.fetchConversation(conId, function(err, data) {
            return callback(data); //TODO return err too
        });
    };

    ///////////////////////
    //TODO
    // Will be adding creationDate
    // Will be adding creatorId
    // Will be looking at a "journal" field which is
    //  the node's action history
    ///////////////////////
    /**
     * create a new node and save it
     * @param {*} type 
     * @param {*} statement 
     * @param {*} details 
     * @param {*} callback err, nodeId
     */
    self.newNode = function(type, statement, details, callback) {
        var node = {};
        node.id = newId();
        node.type = type;
        node.statement = statement;
        node.details = details;
        Database.saveNodeData(node.id, node, function(err) {
            return callback(err, id);
        });
    };

    /**
     * Refer to constants.js for fields
     * @param {*} type 
     * @param {*} node 
     */
    function getChildList(type, node) {
        var result;
        try {
            if (type === constants.ANSWER_NODE_TYPE) {
                result = node.answers;
            } else if (type === constants.CON_NODE_TYPE) {
                result = node.conargs;
            } else if (type === constants.PRO_NODE_TYPE) {
                result = node.proargs;
            } else if (type === constants.QUESTION_NODE_TYPE) {
                result = node.questions;
            } else if (type === constants.NOTE_NODE_TYPE) {
                result = node.notes;
            } else if (type === constants.REFERENCE_NODE_TYPE) {
                result = node.references;
            } // else we're hosed!!!
        } catch (e) {}
        console.log("ConModel.getChildList",type,result,JSON.stringify(node));
        
        return result;
    };

    function setChildList(type, list, node) {
        console.log("ConModel.setChildList",type,list,JSON.stringify(node));
        if (type === constants.ANSWER_NODE_TYPE) {
            node.answers = list;
        } else if (type === constants.CON_NODE_TYPE) {
            node.conargs = list;
        } else if (type === constants.PRO_NODE_TYPE) {
            node.proargs = list;
        } else if (type === constants.QUESTION_NODE_TYPE) {
            node.questions = list;
        } else if (type === constants.NOTE_NODE_TYPE) {
            node.notes = list;
        } else if (type === constants.REFERENCE_NODE_TYPE) {
            node.references = list;
        } // else we're hosed!!!
    };

    self.newResponseNode = function(parentId, type, statement, details, callback) {
        //First, make this node
        var id = newId(),
            node = {};
        node.id = id;
        node.type = type;
        node.details = details;
        node.statement = statement;
        Database.saveNodeData(id, node, function(err) {
            //now update the parent
            var struct = {};
            struct.id = id;
            struct.type = type;
            struct.statement = statement;
            self.fetchView(parentId, function(err, data) {
                console.log("ConversationModel.newResponseNode",parentId,data);
                
                var kids = getChildList(type, data);
                if (!kids) {
                    kids = [];
                }
                setChildList(type, kids, data);
                kids.push(struct);
                Database.saveNodeData(parentId, data, function(err) {
                    return callback(err);
                });
            })
        });
    };
    /**
     * Create a new conversation and its root node
     * @param {*} title 
     * @param {*} details 
     * @param {*} type 
     * @param {*} roottitle 
     * @param {*} rootdetails 
     * @param {*} callback 
     */
    self.newConversation = function(title, details, type, roottitle, rootdetails, callback) {
        var json = {},
            id = newId(),
            xroot;
        console.log("ConModelNewConvo",type);
        //first, create the root node
        json.id = id;
        json.statement = roottitle;
        json.details = rootdetails;
        json.type = type;
        Database.saveNodeData(json.id, json, function(err) {
            //now create the conversation
            xroot = {};
            xroot.id = id;
            xroot.type = type;
            xroot.statement = roottitle;
            json = {};
            json.id = newId();
            json.statement = title;
            json.details = details;
            json.type = constants.CONVERSATION_NODE_TYPE;
            json.rootNode = xroot;
            Database.saveConversationData(json.id, json, function(err) {
                console.log("ModelNewConversation", title, err);            
                return callback(err);
            });
        });
    };

    /**
     * List all conversations
     * @return
     */
    self.listConversations = function() {
        var fileNames= Database.listConversations();
        console.log("LISTS",JSON.stringify(fileNames));
        var result = [],
            temp,
            con;
        if (fileNames.length === 0) {
            return result;
        }
        fileNames.forEach(function(fx) {
            if (!fx.includes(".DS_Store")) { // mac file system
                self.fetchConversation(fx, function(thecon) {
                    console.log("FE", fx, JSON.stringify(thecon));
                    con = {};
                    con.id = thecon.id;
                    con.statement = thecon.statement;
                    result.push(con);
                });
            }
        });
        return result;
    }

};
instance = new Conversation();
module.exports = instance;