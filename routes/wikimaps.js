'use strict';
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var Oriento = require('oriento');
var request = Promise.promisify(require('request'));

var MAX_NUMBER_OF_LINKS = 4;
var MAX_NUMBER_OF_NODES = 200;
var DEFAULT_LINK_LENGTH = 20;

var server = new Oriento({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'password'
});

var graph = server.use("wikipediaOrientDb");
console.log('Using database:' + graph.name);

/**
 * Find articles LIKE passed in title.
 */
router.get('/findArticles', function(req, res) {
  var titleStr = trim(req.query.title);
  var titleStrEndKey = titleStr + "z";
  var queryStr = "select key from index:V.title where key >= '" + titleStr + "' and key <= '" + titleStrEndKey + "' limit 10";
  if (titleStr !== null){
    graph.query(queryStr, {
        params: {
            //keyTitle: titleStr,
            //keyTitleAltered: titleStrEndKey
        }
        //limit: 10
    }).then(function (response){
        res.json(response);
    });
  }
  else{
    res.send(null);
  }
});

function capitalizeWords(str) {
  str.replace(/\b./g, function(m){ return m.toUpperCase(); });
}

router.get('/getLinksForArticle', function(req, res) {
  var titleStr = req.query.title[1];
  var promise = getArticlePromise(titleStr);
  var nodes = [];
  var links = [];
  promise.then(function(article) {
    if (article && article[0] && typeof article[0].out_contains !== 'undefined') {
      var prefetchedRecords = article[0].out_contains._prefetchedRecords;
      var randomLinks = getRandomLinksFromArticle(prefetchedRecords);
      addArticleToArrays(article[0].title, randomLinks, nodes, links);

      //request('http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=100&titles=albert einstein', function (error, response, body) {
      var url = 'http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=100&titles=Albert Einstein';
      request(url).then(function(rawResponse) {
        var response = rawResponse[0];
        if (response.statusCode == 200) {
          var imageInfo = JSON.parse(response.body);
          var pages = imageInfo.query.pages;
          var pageId;
          for (var key in pages) {
            pageId = key;
          }

          res.type('application/json');
          res.json({nodes: nodes, links: links, imageUrl: pages[pageId].thumbnail.source});
        }
      });


    }
    else {
      res.json({});
    }
  }).catch(function(e) {
    console.log(e);
  });
});

/**
 *  Generate Wikimap for article
 */
router.get('/generateWikiMap', function(req, res) {
  var titleStr = req.query.title[1];
  generateWikiMap(titleStr, res);
});

var getArticlePromise = function(titleStr){
  return graph.select().from('V').where({title: titleStr}).limit(1).fetch('out_contains:1 out_contains.in:1').all();
};

var getRandomLinksFromArticle = function(links){
  var randomLinks = [];
  var linkRIDS = Object.getOwnPropertyNames(links);
  for(var i = 0; i < MAX_NUMBER_OF_LINKS; i++){
    var randomLinkRID = linkRIDS.splice(Math.floor(Math.random() * linkRIDS.length),1)[0];
    randomLinks.push(links[randomLinkRID].title);
  }
  return randomLinks;
};

function addLinks(links, currentArticleLinks) {
  for (var i = 0; i < currentArticleLinks.length; i++){
    links.push(currentArticleLinks[i]);
  }
}

var isNodeInList = function (id, nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
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

var addNode = function(title, nodes){
  if (!isNodeInList(title, nodes)){
    nodes.push({'title': title});
  }
};

var addArticleToArrays = function(title, randomLinks, nodes, links){
  addNode(title, nodes);
  for(var i = 0; i < randomLinks.length; i++) {
    addNode(randomLinks[i], nodes);
  }
  var currentArticleLinks = createLinkObjects(title, nodes, randomLinks);
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
        if (article && article[0] && article[0].out_contains) {
          var prefetchedRecords = article[0].out_contains._prefetchedRecords;
          if (article !== null) {
            if (nodes.length < MAX_NUMBER_OF_NODES) {
              var randomLinks = getRandomLinksFromArticle(prefetchedRecords);
              addArticleToArrays(article[0].title, randomLinks);
              for (var i = 0; i < randomLinks.length; i++) {
                addNodeAndLinksToArrays(randomLinks[i]);
              }
            }
            else {
              completeFunc();
            }
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
    res.type('application/json');
    res.json({nodes: nodes, links: links});
    });

};

// remove multiple, leading or trailing spaces
function trim(s) {
  s = s.replace(/(^\s*)|(\s*$)/gi,'');
  s = s.replace(/[ ]{2,}/gi,' ');
  s = s.replace(/\n /,"\n"); return s;
}

module.exports = router;
