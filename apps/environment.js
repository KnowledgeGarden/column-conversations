/**
 * Dependency injection for models.
 * When a new model is added, if it requires any other model, then it must
 * be included in this code.
 * The idea is to create all the models here, then inject dependencies.
 */
var CommonModel = require('./models/common_model');
var TagModel = require('./models/tag_model');
var ConversationModel = require('./models/conversation_model');
var EventLogModel = require('./models/eventlog_model');

Environment = function() {
    var self = this;
    CommonModel.inject(EventLogModel);
    ConversationModel.inject(CommonModel, EventLogModel);
    TagModel.inject(CommonModel);
    EventLogModel.inject(CommonModel);
        
};
module.exports = Environment;
