var constants = require('../constants');
var Common,
    instance;

Common = function() {
    var self = this;

    function newId() {
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
        } else if (type === constants.RELATIONS_NODE_TYPE) {
            return "/images/cogwheel_sm.png";
        } else if (type === constants.BOOKMARKS_NODE_TYPE) {
            return "/images/bookmark_sm.png";
        } else if (type === constants.CONVERSATION_NODE_TYPE) {
            return "/images/ibis/map_sm.png";
        } else if (type === constants.MAP_NODE_TYPE) {
            return "/images/ibis/map_sm.png";
        } else {
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
        } else if (type === constants.RELATIONS_NODE_TYPE) {
            return "/images/cogwheel.png";
        } else if (type === constants.BOOKMARKS_NODE_TYPE) {
            return "/images/bookmark.png";
        } else if (type === constants.CONVERSATION_NODE_TYPE) {
            return "/images/ibis/map.png";
        } else if (type === constants.MAP_NODE_TYPE) {
            return "/images/ibis/map.png";
        } else {
            throw "Bad Type 2 "+type;
        }
    };

        /**
     * Core node creation function
     * @param {*} creatorId 
     * @param {*} type 
     * @param {*} statement 
     * @param {*} details 
     * @returns
     */
    self.newNode = function(creatorId, type, statement, details) {
        var result = {};
        result.id = newId();
        result.creatorId = creatorId;
        result.createdDate = new Date();
        result.version = newId();
        result.type = type;
        result.img = self.nodeTolargeIcon(type);
        result.statement = statement;
        result.details = details;
        console.log("CommonModel.newNode",result);
        return result;
    };

    /**
     * Refer to constants.js for fields
     * @param {*} type 
     * @param {*} node 
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
            } else if (type === constants.RELATIONS_NODE_TYPE) {
                result = node.relations;
            } else if (type === constants.BOOKMARKS_NODE_TYPE) {
                result = node.bookmarks;
            } else {
                    throw "Bad Type 3 "+type;
            } 
        } catch (e) {}
        console.log("ConModel.getChildList",type,result,JSON.stringify(node));
        
        return result;
    };

    self.setChildList = function (type, list, node) {
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
        } else if (type === constants.TAG_NODE_TYPE) {
            node.tags = list;
        } else if (type === constants.DECISIONS_NODE_TYPE) {
            node.decisions = list;
        } else if (type === constants.RELATIONS_NODE_TYPE) {
            node.RELATIONS_NODE_TYPE = list;
        } else if (type === constants.BOOKMARKS_NODE_TYPE) {
            node.bookmarks = list;
        } else {
            throw "Bad Type 4 "+type;
        }
    };

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
instance = new Common();
module.exports = instance;
