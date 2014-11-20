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
  var titleStr = req.query.title;
  if (titleStr != null){
    var queryStr = titleStr.replace(/ /g, "_");
    var regexp = new RegExp('^' + queryStr + ".*", 'i');
    WikiMap.find({title: regexp}, function(err, doc){
      res.send(doc);
    });
  }
  else{
    res.send(null);
  }

});

module.exports = router;
