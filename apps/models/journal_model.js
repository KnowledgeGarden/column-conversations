var constants = require('../constants');
var Database = require('../drivers/file_database_driver');
var CommonModel;
var Journal,
    instance;

Journal = function() {
    var self = this;

    self.inject = function(commModel) {
        CommonModel = commModel;
        console.log("JournalModel",this);        
    };

    self.fetchJournal = function(id, callback) {
        console.log("JournalModel.fetchJournal",id);
        Database.fetchJournal(id, function(err, data) {
            return callback(err, data);            
        });
    };

    /**
     * @param creatorId
     * @param statement
     * @param details
     * @param callback  err node
     */
    self.createJournalEntry = function(creatorId, statement, details, callback) {
        CommonModel.newNode(null, creatorId, constants.BLOG_NODE_TYPE, statement, details, function(node) {
            Database.saveJournalData(node.id, node, function(err) {
                return callback(err, node);
            });
        });
    };

    self.listJournalEntries = function() {
        var fileNames= Database.listJournal();
        console.log("LISTS",fileNames);
        var result = [],
            temp,
            con;
        if (fileNames.length === 0) {
            return result;
        }
        fileNames.forEach(function(fx) {
            if (fx) {
                if (!fx.includes(".DS_Store")) { // mac file system
                    self.fetchJournal(fx, function(err, thecon) {
                        CommonModel.validateNodeImage(thecon, function() {
                            console.log("FJ", fx, thecon);
                            con = {};
                            con.id = thecon.id;
                            con.img = thecon.imgsm;
                            con.statement = thecon.statement;
                            result.push(con);
                        });
                    });
                }
            }
        });
        return result;
    };

};
instance = new Journal();
module.exports = instance;