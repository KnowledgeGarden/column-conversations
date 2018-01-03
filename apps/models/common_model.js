var constants = require('../constants');
var environment = require('../environment');
var EventLogModel; // = environment.EventLogModel;
var Common,
    instance;

Common = function() {
    var self = this;

    self.inject = function(eventModel) {
        EventLogModel = eventModel;
    //    console.log("CommonModel",environment,EventLogModel);
    }

    // user UUIDs for Node IDs
    // TODO not used
    self.newUUID = function() {
        return uuid.v4();
    };


    /**
     * Some potential for collision
     * @return
     */
    self.newId = function() {
        var d = new Date();
        return d.getTime().toString();
    }

    self.nodeToSmallIcon = function(type) {
        if (type === constants.ANSWER_NODE_TYPE) {
            return "/images/ibis/position_sm.png";
        } else if (type === constants.CON_NODE_TYPE) {
            return "/images/ibis/minus_sm.png";
        } else if (type === constants.PRO_NODE_TYPE) {
            return "/images/ibis/plus_sm.png";
        } else if (type === constants.QUESTION_NODE_TYPE) {
            return "/images/ibis/issue_sm.png";
        } else if (type === constants.NOTE_NODE_TYPE) {
            return "/images/ibis/note_sm.png";
        } else if (type === constants.REFERENCE_NODE_TYPE) {
            return "/images/ibis/reference_sm.png";
        } else if (type === constants.TAG_NODE_TYPE) {
            return "/images/tag_sm.png";
        } else if (type === constants.DECISION_NODE_TYPE) {
            return "/images/ibis/decision_sm.png";
        } else if (type === constants.RELATION_NODE_TYPE) {
            return "/images/cogwheel_sm.png";
        } else if (type === constants.BOOKMARK_NODE_TYPE) {
            return "/images/bookmark_sm.png";
        } else if (type === constants.CONVERSATION_NODE_TYPE) {
            return "/images/ibis/map_sm.png";
        } else if (type === constants.MAP_NODE_TYPE) {
            return "/images/ibis/map_sm.png";
        } else if (type === constants.BLOG_NODE_TYPE) {
            return "/images/publication_sm.png";
        } else {
            console.log("CommonModel.nodeToSmallIcon ERROR",type);
            throw "Bad Type 1 "+type;
        }
    };

    self.nodeTolargeIcon = function(type) {
        if (type === constants.ANSWER_NODE_TYPE) {
            return "/images/ibis/position.png";
        } else if (type === constants.CON_NODE_TYPE) {
            return "/images/ibis/minus.png";
        } else if (type === constants.PRO_NODE_TYPE) {
            return "/images/ibis/plus.png";
        } else if (type === constants.QUESTION_NODE_TYPE) {
            return "/images/ibis/issue.png";
        } else if (type === constants.NOTE_NODE_TYPE) {
            return "/images/ibis/note.png";
        } else if (type === constants.REFERENCE_NODE_TYPE) {
            return "/images/ibis/reference.png";
        } else if (type === constants.TAG_NODE_TYPE) {
            return "/images/tag.png";
        } else if (type === constants.DECISION_NODE_TYPE) {
            return "/images/ibis/decision.png";
        } else if (type === constants.RELATION_NODE_TYPE) {
            return "/images/cogwheel.png";
        } else if (type === constants.BOOKMARK_NODE_TYPE) {
            return "/images/bookmark.png";
        } else if (type === constants.CONVERSATION_NODE_TYPE) {
            return "/images/ibis/map.png";
        } else if (type === constants.MAP_NODE_TYPE) {
            return "/images/ibis/map.png";
        } else if (type === constants.BLOG_NODE_TYPE) {
            return "/images/publication.png";
        } else {
            console.log("CommonModel.nodeTolargeIcon ERROR",type);
            throw "Bad Type 2 "+type;
        }
    };

    /**
     * Core node creation function
     * @param nodeId  can be null
     * @param {*} creatorId 
     * @param {*} type 
     * @param {*} statement 
     * @param {*} details 
     * @param callback json
     */
    self.newNode = function(nodeId, creatorId, type, statement, details, callback) {
        console.log("CommonModel.newNode"+creatorId,type);
        var result = {},
            ix = nodeId;
        if (!ix) {
            ix = self.newId();
        }
        result.id = ix;
        result.creatorId = creatorId;
        result.createdDate = new Date();
        result.version = self.newId();
        result.type = type;
        result.img = self.nodeTolargeIcon(type);
        result.statement = statement;
        result.details = details;
        EventLogModel.registerEvent(creatorId, constants.NEW_NODE_EVENT, result, function(err) {
            console.log("CommonModel.newNode",creatorId,type,result);
            return callback(result);
        });
    };

    /**
     * Refer to constants.js for fields
     * @param {*} type 
     * @param {*} node
     * @return possibly empty array
     */
    self.getChildList = function (type, node) {
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
            } else if (type === constants.TAG_NODE_TYPE) {
                result = node.tags;
            } else if (type === constants.DECISION_NODE_TYPE) {
                result = node.decisions;
            } else if (type === constants.RELATION_NODE_TYPE) {
                result = node.relations;
            } else if (type === constants.BOOKMARKS_NODE_TYPE) {
                result = node.bookmarks;
            } else if (type === constants.BLOG_NODE_TYPE) {
                result = node.journals;
            } else {
                    throw "Bad Type 3 "+type;
            } 
        } catch (e) {}
        if (!result) {
            result = [];
        }
        console.log("ConModel.getChildList",type,result,node);     
        return result;
    };

    self.setChildList = function (type, list, node) {
        console.log("ConModel.setChildList",type,list,node);
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
        } else if (type === constants.TAG_NODE_TYPE) {
            node.tags = list;
        } else if (type === constants.DECISIONS_NODE_TYPE) {
            node.decisions = list;
        } else if (type === constants.RELATION_NODE_TYPE) {
            node.relations = list;
        } else if (type === constants.BOOKMARKS_NODE_TYPE) {
            node.bookmarks = list;
        } else if (type === constants.BLOG_NODE_TYPE) {
            node.journals = list;
        } else {
            throw "Bad Type 4 "+type;
        }
    };


    /**
     * Add a child struct to a given node
     * @param {*} childType 
     * @param {*} sourceNode 
     * @param {*} targetNode 
     */
    self.addStructToNode = function(childType, sourceNode, targetNode) {
        console.log("CommonModel.addStructToNode",childType,sourceNode,targetNode);
        var struct = {},
            type = sourceNode.type,
            img = self.nodeToSmallIcon(type);
        struct.id = sourceNode.id;
        struct.img = img;
        struct.type = type;
        struct.statement = sourceNode.statement;
        var kids = self.getChildList(childType, targetNode);
        if (!kids) {
            kids = [];
        }
        kids.push(struct);
        self.setChildList(childType, kids, targetNode);
    };
};
//noticed that if you call a class > 1 times, best to
// just send a singleton
if (!instance) {
    instance = new Common();
}
module.exports = instance;
