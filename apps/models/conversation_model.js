const DataPath = "../../data/";
const environment = require('../environment');
const ConversationPath = DataPath+"conversations/";
var Database = require('../drivers/file_database_driver');
var CommonModel = environment.CommonModel;
var EventModel = environment.EventLogModel;
var uuid = require('uuid');
var constants = require('../constants');
var Conversation,
    instance;

Conversation = function() {
    var self = this;

    self.inject = function(commModel, eventModel) {
        CommonModel = commModel;
        EventModel = eventModel;
    //    console.log("ConversationModel",environment,CommonModel,EventModel);
    };

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


    //////////////////////////////
    // TODO
    //  Making conversations about heterogeneous node types is complicated.
    //      In the file-based system:
    //          All conversation nodes go in /data
    //          All bookmark nodes go in /data/bookmarks
    //      To make matters worse:
    //          If someone plugs in a new app, e.g. blog,
    //          Then we need to deal with that as well.
    //  BEST to let the interpretation of where to save a node be handled
    //      in the database_driver.
    //  Same thing goes for fetching
    //      fetchView ASSUMES it is a conversation node.
    //          IN FACT, it might be a bookmark,blog, etc.
    //////////////////////////////

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
       Database.fetchData(parentId, function(err, data) {
            console.log("ConversationModel.newResponseNode",type,parentId,data);
            CommonModel.newNode(null, creatorId, type, statement, details, function(node) {
                console.log("ConversationModel.newResponseNode-1",type,node);
                CommonModel.addStructToNode(type, node, data);
                // We cannot just do a "saveNodeData"
                // because we do not know what the parent nodetype is
                var parentType = data.type;
                Database.saveNodeData(parentId, data, function(err) {
                    Database.saveNodeData(node.id, node, function(ex) {
                        return callback(ex);
                    });
                });
            });
        });
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
        CommonModel.newNode(null, creatorId, type, roottitle, rootdetails, function(json) {
            var id = json.id,
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
if (!instance) {
    instance = new Conversation();
}
module.exports = instance;