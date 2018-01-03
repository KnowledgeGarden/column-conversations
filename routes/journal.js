var express = require('express');
var router = express.Router();
var constants = require('../apps/constants');
var JournalModel = require('../apps/models/journal_model');
var helper = require('./helper');

router.get("/journalindex", helper.isPrivate, function(req, res, next) {
    req.session.curCon = null;
    var data = helper.startData(req);
    data.journallist = JournalModel.listJournalEntries();
    res.render('journal_index', data);
});


router.get('/new', function(req, res, next) {
    var data = helper.startData(req)
    data.formtitle = "New Journal Entry";
    data.action = "/journal/newnode";
    return res.render('newnode_form', data);
});

router.get('/:id', function(req, res, next) {
    var data = helper.startData(req),
        id = req.params.id;
//    console.log("Bookmark.get",id);
    JournalModel.fetchJournal(id, function(err, result) {
        console.log("Model returned "+result);
        data.result = result;
        return res.render('view', data);
    });
});

router.post('/newnode', function(req, res, next) {
    var title = req.body.title
        details = req.body.details,
        creatorId = req.session.theUser;
    JournalModel.createJournalEntry(creatorId, title, details, function(err, entry) {

        return res.redirect("/journal/"+entry.id);
    });
});

module.exports = router;