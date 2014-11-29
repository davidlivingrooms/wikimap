'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');

Promise.promisifyAll(require("mongoose"));

mongoose.connect('mongodb://localhost/wikimapper');

var wikiMapSchema = {
  title: String,
  titles: [String]
};

var WikiMap = mongoose.model('Wikimap', wikiMapSchema, 'links');

Promise.promisifyAll(WikiMap);
Promise.promisifyAll(WikiMap.prototype);

var MAX_NUMBER_OF_LINKS = 4;
var MAX_NUMBER_OF_NODES = 100;
var DEFAULT_LINK_LENGTH = 10;

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

var getArticlePromise = function(titleStr){
  return WikiMap.findOne({title:titleStr}).lean().execAsync();
};

var getRandomLinksFromArticle = function(links){
  var randomLinks = [];
  for(var i = 0; i < MAX_NUMBER_OF_LINKS; i++){
    //TODO what happens when not enough links
    var randomlink = links.splice(Math.floor(Math.random() * links.length),1)[0];
    randomLinks.push(randomlink);
  }
  return randomLinks;
};

var createLink = function(source, target){
  return {"source": source, "target": target, "value": DEFAULT_LINK_LENGTH}
};

var createLinks = function(parentNode, links){
  var articleLinks = [];
  for(var i = 0; i < links.length; i++) {
    articleLinks.push(createLink(parentNode, links[i]));
  }
  return articleLinks;
};

function addLinks(links, currentArticleLinks) {
  for (var i = 0; i < currentArticleLinks.length; i++){
    links.push(currentArticleLinks[i]);
  }
}
var addArticleToArrays = function(article, nodes, links){
  var title = article.title;
  var randomLinks = getRandomLinksFromArticle(article.links);
  nodes.push({"id": title});
  for(var i = 0; i < randomLinks.length; i++) {
    nodes.push({"id": randomLinks[i]});
  }
  var currentArticleLinks = createLinks(title, randomLinks);
  addLinks(links, currentArticleLinks);
};

var generateWikiMap = function(titleStr, res){

  var nodes = [];
  var links = [];

  function doSomethingAsync(titleStr) {
    var completeFunc, errFunc;

    var p = new Promise(function (resolve, reject) {
      completeFunc = resolve;
      errFunc = reject;
    });

    function addNodeAndLinksToArrays(titleStr) {

      var promise = getArticlePromise(titleStr);
      promise.then(function(article) {
        if (nodes.length < MAX_NUMBER_OF_NODES) {
          addArticleToArrays(article, nodes, links);
          for (var i = 0; i < article.links.length; i++) {
            addNodeAndLinksToArrays(article.links[i]);
          }
        } else {
          completeFunc()
        }
      }).catch(function(e) {
        console.log(e);
      });
    }
    // Kick off the async work
    addNodeAndLinksToArrays(titleStr);

    // return the promise for outside callers to wait on
    return p;
  }

  doSomethingAsync(titleStr).then(function() {
      res.json({nodes: nodes, links: links});
    });

};


module.exports = router;
