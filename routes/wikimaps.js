'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/wikimapper');

var wikiMapSchema = {
  title: String,
  titles: [String]
};

var WikiMap = mongoose.model('Wikimap', wikiMapSchema, 'links');

/* GET wikimaps listing. */
router.get('/', function(req, res) {
  //TODO req.query.title to get the title param
  WikiMap.findOne(function(err, doc){
    res.send(doc);
  });
});

module.exports = router;
