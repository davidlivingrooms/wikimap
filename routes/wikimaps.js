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

/**
 * Find articles LIKE passed in title.
 */
router.get('/findArticles', function(req, res) {
  var titleStr = req.query.title;
  if (titleStr != null){
    var queryStr = titleStr.replace(/ /g, "_");
    var regexp = new RegExp('^' + queryStr + ".*", 'i');
    WikiMap.find({title: regexp})
    .limit(10)
    .exec(function(err, articles){
      res.send(articles);
    });
  }
  else{
    res.send(null);
  }
});

/**
 * Find a single article by title.
 */
router.get('/findArticleByTitle', function(req, res) {
  var titleStr = req.query.title;
  WikiMap.find({title: titleStr}).limit(1)
  .exec(function(err, article){
    res.send(article);
  });
})

/**
 *  Generate Wikimap for article
 */
router.get('/generateWikiMap', function(req, res) {
  var titleStr = req.query.title;
  generateWikiMap(titleStr, res)
});


var generateWikiMap = function(titleStr, res){
  WikiMap.find({title: titleStr})
  .limit(1)
  .exec(function(err, article){
    //res.send(article);
    //TODO pull links out of article
    for (var i = 0; i < article.links.length; i++)
    {

    }
    //TODO get each links article and their links
    //TODO max node


  });
};


module.exports = router;
