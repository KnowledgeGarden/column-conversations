var constants = require('../constants');
var Database = require('../drivers/file_database_driver');
var CommonModel = require('./common_model');
var Bookmark,
    instance;

Bookmark = function() {
    var self = this;

//    console.log("Bookmark",CommonModel);
    /**
     * Create a new bookmark (aka WebClip)
     * Caller must pay attention to returned error in case the USL is missing
     * @param {*} creatorId 
     * @param {*} url required
     * @param {*} statement 
     * @param {*} details 
     * @param {*} callback err
     */
    self.newBookmark = function(creatorId, url, statement, details, callback) {
//        console.log("BookmarkModel.newBookmark",creatorId,url,statement);
        var node = CommonModel.newNode(creatorId, constants.BOOKMARK_NODE_TYPE, statement, details)
        node.url = url;
//        console.log("BookmarkModel.newBookmark-1"+node);
        Database.saveBookmarkData(node.id, node, function(err) {
            return callback(err);
        });
    };

    self.fetchBookmark = function(id, callback) {
//        console.log("BookmarkModel.fetchBookmark",id);
        Database.fetchBookmark(id, function(err, data) {
            return callback(err, data);
        });
    };

    self.listBookmarks = function() {
        var fileNames= Database.listBookmarks();
        console.log("BookmarkModel.listBookmarks",fileNames);
        var result = [],
            temp,
            con;
        if (fileNames.length === 0) {
            return result;
        }
        fileNames.forEach(function(fx) {
            if (!fx.includes(".DS_Store")) { // mac file system
                self.fetchBookmark(fx, function(err, thecon) {
//                    console.log("FB", fx, thecon);
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
    instance = new Bookmark();
}
module.exports = instance;
