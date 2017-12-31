const DataPath = "../../data/";
const TagPath = DataPath+"tags/";
var Database = require('../drivers/file_database_driver');
const environment = require('../environment');
var CommonModel; // = environment.CommonModel;
var uuid = require('uuid');
var constants = require('../constants');
var Tags,
    instance;

Tags = function() {
    var self = this;

    self.inject = function(commModel) {
        CommonModel = commModel;
    //    console.log("TagModel",environment,CommonModel);
    }
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

    //https://stackoverflow.com/questions/1137436/what-are-useful-javascript-methods-that-extends-built-in-objects/1137579#1137579
    String.prototype.replaceAll = function(search, replace)
    {
        //if replace is not sent, return original string otherwise it will
        //replace search string with 'undefined'.
        if (replace === undefined) {
            return this.toString();
        }
    
        return this.replace(new RegExp('[' + search + ']', 'g'), replace);
    };

    function labelToId(label) {
        var result = label.replaceAll(' ', '_');
        result = result.toLowerCase();
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
            console.log("TagModel.newTag",tagLabel,id,data);
            if (data) {
                var theTag = data;
                wireTagNode(theTag, nodeId);
                console.log("TagModel.newTag-1",theTag);
                return callback(err);
            } else {
                CommonModel.newNode(creatorId, constants.TAG_NODE_TYPE, tagLabel, "", function(theTag) {
                    theTag.id = id;
                    wireTagNode(theTag, nodeId);
                    console.log("TagModel.newTag-1",theTag);
                    return callback(err);
                });
            }
        });
    };

    self.listTags = function() {
        var fileNames = Database.listTags();
        console.log("TAGLISTS",JSON.stringify(fileNames));
        var result = [],
            temp,
            con;
        if (fileNames.length === 0) {
            return result;
        }
        fileNames.forEach(function(fx) {
            if (!fx.includes(".DS_Store")) { // mac file system
                self.fetchTag(fx, function(err, thecon) {
                    console.log("TFE", fx, thecon);
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

};
if (!instance) {
    instance = new Tags();
}
module.exports = instance;