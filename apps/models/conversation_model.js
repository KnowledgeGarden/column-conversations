const DataPath = "../../data/";
const ConversationPath = DataPath+"conversations/";
var Database = require('../drivers/file_database_driver');
var CommonModel = require('./common_model');
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
        console.log("ConversationModel.fetchView",viewId);
        Database.fetchNode(viewId, function(err, data) {
            console.log("ConversationModel.fetchView++",err,data);
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
     * @param creatorId
     * @param {*} type 
     * @param {*} statement 
     * @param {*} details 
     * @param {*} callback err, nodeId
     */
    self.newNode = function(creatorId, type, statement, details, callback) {
        var node = CommonModel.newNode(creatorId, type, statement, details);
        Database.saveNodeData(node.id, node, function(err) {
            return callback(err, id);
        });
    };


    /**
     * Create a response node and add its reference to the parent
     * @param {*} creatorId 
     * @param {*} parentId 
     * @param {*} type 
     * @param {*} statement 
     * @param {*} details 
     * @param {*} callback 
     */
    self.newResponseNode = function(creatorId, parentId, type, statement, details, callback) {
       self.fetchView(parentId, function(err, data) {
            console.log("ConversationModel.newResponseNode",parentId,data);
            var node = CommonModel.newNode(creatorId, type, statement, details);
            CommonModel.addStructToNode(type, node, data);
            Database.saveNodeData(parentId, data, function(err) {
                Database.saveNodeData(node.id, node, function(ex) {
                    return callback(ex);
                });
            });
        });
        //});
    };
    /**
     * Create a new conversation and its root node
     * @param creatorId
     * @param {*} title 
     * @param {*} details 
     * @param {*} type 
     * @param {*} roottitle 
     * @param {*} rootdetails 
     * @param {*} callback returns new conversation's id
     */
    self.newConversation = function(creatorId, title, details, type, roottitle, rootdetails, callback) {
        //first, create the root node
        var json = CommonModel.newNode(creatorId, type, roottitle, rootdetails),
            id = json.id,
            xroot;
        console.log("ConModelNewConvo",type);
        Database.saveNodeData(json.id, json, function(err) {
            //now create the conversation
            xroot = {};
            xroot.id = id;
            xroot.type = type;
            xroot.statement = roottitle;
            json = CommonModel.newNode(creatorId, constants.CONVERSATION_NODE_TYPE, title, details);
            json.rootNode = xroot;
            Database.saveConversationData(json.id, json, function(err) {
                console.log("ModelNewConversation", title, err);            
                return callback(id);
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
                    con.img = thecon.img;
                    con.statement = thecon.statement;
                    result.push(con);
                });
            }
        });
        return result;
    };

    function fetchAllkidStructs(node) {
        //There really is a better way to do this
        var result = [];
        var snappers = node.answers;
        if (snappers) {
            result = snappers;
        }
        snappers = node.questions;
        if (snappers) {
            result = result.concat(snappers);
        }
        snappers = node.proargs;
        if (snappers) {
            result = result.concat(snappers);
        }
        snappers = node.conargs;
        if (snappers) {
            result = result.concat(snappers);
        }
        snappers = node.notes;
        if (snappers) {
            result = result.concat(snappers);
        }
        snappers = node.references;
        if (snappers) {
            result = result.concat(snappers);
        }
        snappers = node.decisions;
        if (snappers) {
            result = result.concat(snappers);
        }
        return result;
    };

    function recursor(thisNode, childStruct, callback) {

    }
    /**
     * A recursive tree builder which returns a JSON tree
     * @param {string} rootNodeId
     * @param {string} parentNodeId can be null or undefined at first
     * @callback JSON
     * https://www.jstree.com/docs/json/
     */
    self.toJsTree = function(rootNodeId, parentNode, callback) {
        console.log("ConversationModel.toJsTree",rootNodeId,parentNode);
        var parentStack = [];
        parentStack.push(rootNodeId)
        var thisNode,
            childArray,
            childNode,
            childStruct;
        //fetch this parent
        self.fetchView(rootNodeId, function(err, data) {
            console.log("ConversationModel.toJsTree-1",rootNodeId,data);            
            //craft thisNode
            thisNode = {};
            thisNode.id = data.id;
            if (!parentNode) {
                var state = {};
                state.opened = true;
                thisNode.state = state;
            }
            thisNode.text = data.statement;
            thisNode.icon = CommonModel.nodeToSmallIcon(data.type);
            //We are now crafting the children of thisNode
            var parentKids = thisNode.children;
            if (!parentKids) {
                parentKids = [];
            }
            var snappers = fetchAllkidStructs(data);
            if (snappers) {
                var len = snappers.length;
                while (len > 0) {      
                    childStruct = snappers.pop();
                    len = snappers.length;
                    if (childStruct) {
                        //recurse
                        self.toJsTree(childStruct.id, thisNode, function(tree) {
                            console.log("ConversationModel.toJsTree-2",rootNodeId,data);            
                            parentKids.push(tree);
                        });
                    }
                    console.log("ConversationModel.toJsTree-3",len,parentKids);
                }
                if (parentKids.length > 0) {
                    thisNode.children = parentKids;                    
                }
            }
            console.log("ConversationModel.toJsTree++",thisNode);
            return callback(thisNode); 
        });
    };

};
instance = new Conversation();
module.exports = instance;