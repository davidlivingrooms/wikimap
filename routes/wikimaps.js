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
  var titleStr = req.query.title[1];
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

function addLinks(links, currentArticleLinks) {
  for (var i = 0; i < currentArticleLinks.length; i++){
    links.push(currentArticleLinks[i]);
  }
}

var generateWikiMap = function(titleStr, res){

  var nodes = [];
  var links = [];

  var isNodeInList = function (id) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        return true;
      }
    }
    return false;
  };

  var findNode = function (id) {
    for (var i in nodes) {
      if (nodes[i]["id"] === id) return i;
    }
  };

  var createLink = function(source, target){
    return {"source": findNode(source), "sourceName": source, "target": findNode(target), "targetName": target, "value": DEFAULT_LINK_LENGTH}
  };

  var createLinkObjects = function(parentNode, links){
    var articleLinks = [];
    for(var i = 0; i < links.length; i++) {
      articleLinks.push(createLink(parentNode, links[i]));
    }
    return articleLinks;
  };

  var addNode = function(title){
    if (!isNodeInList(title)){
      nodes.push({"id": title});
    }
  };

  var addArticleToArrays = function(title, randomLinks){
    addNode(title);
    for(var i = 0; i < randomLinks.length; i++) {
      addNode(randomLinks[i]);
    }
    var currentArticleLinks = createLinkObjects(title, randomLinks);
    addLinks(links, currentArticleLinks);
  };

  function doSomethingAsync(titleStr) {
    var completeFunc, errFunc;

    var p = new Promise(function (resolve, reject) {
      completeFunc = resolve;
      errFunc = reject;
    });

    function addNodeAndLinksToArrays(titleStr) {

      var promise = getArticlePromise(titleStr);
      promise.then(function(article) {
        if (article !== null) {
          if (nodes.length < MAX_NUMBER_OF_NODES) {
            var randomLinks = getRandomLinksFromArticle(article.links);
            addArticleToArrays(article.title, randomLinks);
            for (var i = 0; i < randomLinks.length; i++) {
              addNodeAndLinksToArrays(randomLinks[i]);
            }
          } else {
            completeFunc()
          }
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
    //res.type('json');
    res.type('application/json');

    res.json({nodes: nodes, links: links});
    });

};


module.exports = router;
