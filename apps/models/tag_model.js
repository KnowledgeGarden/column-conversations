const DataPath = "../../data/";
const TagPath = DataPath+"tags/";
var Database = require('../drivers/file_database_driver');
var uuid = require('uuid');
var constants = require('../constants');
var Tags,
    instance;

Tags = function() {
    var self = this;

    /**
     * We are defining a tag against a particular node.
     * If that tag already exists, we don't make it again;
     *   instead, we simply add the new node to it's list of nodes
     * @param {*} tagLabel 
     * @param {*} nodeId 
     * @param {*} callback err
     */
    self.newTag = function(tagLabel, nodeId, callback) {
        //TODO
    };

    self.listTags = function() {
        //TODO
    };

};

instance = new Tags();
module.exports = instance