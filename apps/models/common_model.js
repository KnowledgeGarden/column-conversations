var constants = require('../constants');
var Common,
    instance;

Common = function() {
    var self = this;

    function newId() {
        var d = new Date();
        return d.getTime().toString();
    }

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
        result.statement = statement;
        result.details = details;
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
            } // else we're hosed!!!
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
        } // else we're hosed!!!
    };

};
instance = new Common();
module.exports = instance;
