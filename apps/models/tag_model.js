const DataPath = "../../data/";
const TagPath = DataPath+"tags/";
var Database = require('../drivers/file_database_driver');
var CommonModel = require('./common_model');
var uuid = require('uuid');
var constants = require('../constants');
var Tags,
    instance;

Tags = function() {
    var self = this;


    /**
     * Fetch a tag
     * @param {*} viewId 
     * @param {*} callback err json
     */
    self.fetchTag = function(id, callback) {
        console.log("TagModel.fetchTag", id);
        Database.fetchTag(id, function(err, data) {
            return callback(err, data);            
        });
    };

    function labelToId(label) {
        var result = label.replace(' ', '_');
        return result;
    };

    /////////////////////
    // When a node is tagged, both the node and the
    // tag know about it, using the "tags" field in each
    ////////////////////
    function addNodeToTag(node, tag) {
        console.log("TagModel.addNodeToTag",node,tag);
        CommonModel.addStructToNode(constants.TAG_NODE_TYPE, node, tag);
        var kids = CommonModel.getChildList(constants.TAG_NODE_TYPE, tag);
        if (!kids) {
            kids = [];
        }    
        var struct = {};
        struct.id = node.id;
        struct.type = node.type;
        struct.statement = node.statement;
        kids.push(struct);
        CommonModel.setChildList(tag.type, kids, tag);
    };

    function wireTagNode(tag, nodeId) {
        console.log("TagModel.wireTagNode", nodeId, JSON.stringify(tag));
        //fetch node
        Database.fetchNode(nodeId, function(err, node) {
            CommonModel.addStructToNode(constants.TAG_NODE_TYPE, node, tag);
            CommonModel.addStructToNode(constants.TAG_NODE_TYPE, tag, node);
    /*        //first add this node to that tag
            addNodeToTag(node, tag);
            var kids = CommonModel.getChildList(constants.TAG_NODE_TYPE, node);
            if (!kids) {
                kids = [];
            }
            var struct = {};
            struct.id = tag.id;
            struct.type = tag.type;
            struct.statement = tag.statement;
            kids.push(struct);
            CommonModel.setChildList(tag.type, kids, node);
            //before going, save both of them*/
            Database.saveNodeData(nodeId, node, function(err) {
                console.log("TagModel.wireTagNode-1"+JSON.stringify(tag));
                Database.saveTagData(tag.id, tag, function(err) {
                    return;
                });
            });
        });
    };

    /**
     * We are defining a tag against a particular node.
     * If that tag already exists, we don't make it again;
     *   instead, we simply add the new node to it's list of nodes
     * @param creatorId
     * @param {*} tagLabel 
     * @param {*} nodeId 
     * @param {*} callback err
     */
    self.newTag = function(creatorId, tagLabel, nodeId, callback) {
        var id = labelToId(tagLabel);
        self.fetchTag(id, function(err, data) {
            var theTag;
            if (data) {
                theTag = data;
            } else {
                theTag = CommonModel.newNode(creatorId, constants.TAG_NODE_TYPE, id, "" );
                theTag.id = id;
            }
 //       CommonModel.addStructToNode(constants.TAG_NODE_TYPE, node, tag);
            wireTagNode(theTag, nodeId);
            return callback(err);
        });
    };

    self.listTags = function() {
        return Database.listTags();
    };

};

instance = new Tags();
module.exports = instance