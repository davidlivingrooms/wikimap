'use strict';
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/wikimap';
//var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/wikimap ';
var request = Promise.promisify(require('request'));

var MAX_NUMBER_OF_LINKS = 4;
var DEFAULT_LINK_LENGTH = 20;

router.get('/findArticles', function(req, res) {
  var results = [];
  var titleStr = trim(req.query.title);
  pg.connect(connectionString, function(err, client, done) {
    var query = client.query("SELECT id, title FROM article WHERE LOWER(title) LIKE LOWER($1) LIMIT 10", [titleStr + '%']);
    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    if(err) {
      console.log(err);
    }
  });
});

router.get('/getArticleInfo', function(req, res) {
  var results = [];
  var titleStr = req.query.title.toLowerCase();
  //var promise = getArticlePromise(titleStr, articleId);
  var links = [];

  pg.connect(connectionString, function(err, client, done) {
    var query = client.query("SELECT * FROM article WHERE LOWER(title) = LOWER($1)", [titleStr]);
    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      var unknownThumbnail = 'http://upload.wikimedia.org/wikipedia/commons/3/37/No_person.jpg';
      //return res.json({nodes: [], rid: rid, imageUrl: unknownThumbnail});
      return res.json(results);
    });

    if(err) {
      console.log(err);
    }
  });






  //promise.then(function(rawArticle) {
  //  if (rawArticle && rawArticle[0]) {
  //    var article = rawArticle[0];
  //    var articleTitle = article.title;
  //    var rid = article['@rid'].toString().substr(1);
  //    var unknownThumbnail = 'http://upload.wikimedia.org/wikipedia/commons/3/37/No_person.jpg';
  //
  //    if (typeof article.out_contains !== 'undefined') {
  //      var prefetchedRecords = article.out_contains._prefetchedRecords;
  //      var randomLinks = getRandomLinksFromArticle(prefetchedRecords);
  //      addArticleToArrays(article, randomLinks, nodes, links);
  //      res.json({nodes: nodes, rid: rid, imageUrl: unknownThumbnail});
  //    }
  //    else{
  //      res.json({nodes: [], rid: rid, imageUrl: unknownThumbnail});
  //    }

      //var url = 'http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=100&titles=' + articleTitle;
      //request(url).then(function(rawResponse) {
      //  var response = rawResponse[0];
      //
      //  if (response.statusCode !== 200) {
      //    res.json({nodes: [], rid: rid, imageUrl: unknownThumbnail});
      //  }
      //
      //  var imageInfo = JSON.parse(response.body);
      //  var pages = imageInfo.query.pages;
      //  var pageId;
      //  for (var key in pages) {
      //    pageId = key;
      //  }
      //
      //  var summaryUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&pageids=' + pageId;
      //
      //  request(summaryUrl).then(function(rawResponse) {
      //    var summaryInfo = JSON.parse(rawResponse[0].body);
      //    var summaryText = summaryInfo.query.pages[pageId].extract;
      //    var thumbnail = pages[pageId].thumbnail;
      //    var sourceImage;
      //    if (typeof thumbnail === 'undefined' || typeof thumbnail.source === 'undefined') {
      //      sourceImage = unknownThumbnail;
      //    }
      //    else {
      //      sourceImage = thumbnail.source;
      //    }
      //
      //    if (typeof article.out_contains !== 'undefined') {
      //      var prefetchedRecords = article.out_contains._prefetchedRecords;
      //      var randomLinks = getRandomLinksFromArticle(prefetchedRecords);
      //      addArticleToArrays(article, randomLinks, nodes, links);
      //      res.json({nodes: nodes, rid: rid, imageUrl: sourceImage, summaryText: summaryText});
      //    }
      //    else{
      //      res.json({nodes: [], rid: rid, imageUrl: sourceImage, summaryText: summaryText});
      //    }
      //  });
      //});
    //}
  //}).catch(function(e) {
  //  console.log(e);
  //});
});

var getArticlePromise = function(articleId){
  return graph.select().from('#' + rid).fetch('out_contains:1 out_contains.in:1').all();
};

var getRandomLinksFromArticle = function(links){
  var randomLinks = [];
  var linkRIDS = Object.getOwnPropertyNames(links);
  var numOfRIDS = linkRIDS.length;
  var linkCeiling = numOfRIDS < MAX_NUMBER_OF_LINKS ? numOfRIDS : MAX_NUMBER_OF_LINKS;
  for(var i = 0; i < linkCeiling; i++){
    var randomLinkRID = linkRIDS.splice(Math.floor(Math.random() * linkRIDS.length),1)[0];
    randomLinks.push(links[randomLinkRID]);
  }
  return randomLinks;
};

function addLinks(links, currentArticleLinks) {
  for (var i = 0; i < currentArticleLinks.length; i++){
    links.push(currentArticleLinks[i]);
  }
}

var isNodeInList = function (article, nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].title === article.title) {
      return true;
    }
  }
  return false;
};

var findNode = function (id, nodes) {
  for (var i in nodes) {
    if (nodes[i].id === id) {
      return i;
    }
  }
};

var createLink = function(source, target, nodes, links){
  return {'source': findNode(source), 'sourceName': source, 'target': findNode(target, nodes, links), 'targetName': target, 'value': DEFAULT_LINK_LENGTH};
};

var createLinkObjects = function(parentNode, nodes, links){
  var articleLinks = [];
  for(var i = 0; i < links.length; i++) {
    articleLinks.push(createLink(parentNode, links[i], nodes, links));
  }
  return articleLinks;
};

var addNode = function(article, nodes){
  if (!isNodeInList(article, nodes)){
    nodes.push({'title': article.title, 'rid': article['@rid'].toString().substr(1)});
  }
};

var addArticleToArrays = function(article, randomLinks, nodes, links){
  addNode(article, nodes);
  for(var i = 0; i < randomLinks.length; i++) {
    addNode(randomLinks[i], nodes);
  }
  var currentArticleLinks = createLinkObjects(article, nodes, randomLinks);
  addLinks(links, currentArticleLinks);
};

// remove multiple, leading or trailing spaces
function trim(s) {
  s = s.replace(/(^\s*)|(\s*$)/gi,'');
  s = s.replace(/[ ]{2,}/gi,' ');
  s = s.replace(/\n /,"\n"); return s;
}

module.exports = router;
