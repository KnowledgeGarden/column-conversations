/**
 * Two kinds of event logs:
 *  A raw event log -- timeline -- which includes event type,
 *   the node, who did it
 *  A recent log which is restricted only to events of type NewNode
 */
var constants = require('../constants');
var Database = require('../drivers/file_database_driver');
var CommonModel = require('./common_model');
var EventLog,
    instance;

EventLog = function() {
    var self = this;

    function registerRecent(creatorId, node, callback) {

    };

    self.registerEvent = function(creatorId, eventType, node, callback) {

    };

    self.listRecentEvents = function(start, count, callback) {

    };

    self.listHistory = function(start, count, callback) {

    };


};
if (!instance) {
    instance = new EventLog();
}
module.exports = instance;