'use strict';
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/wikimap';
var request = Promise.promisify(require('request'));

var MAX_NUMBER_OF_LINKS = 5;

router.get('/findArticles', function(req, res) {
  var results = [];
  var titleStr = trim(req.query.title);
  pg.connect(connectionString, function(err, client, done) {
    var query = client.query("select id, title from article where title ilike $1 ORDER BY title limit 10;", [titleStr + '%']);
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
  var titleStr = req.query.title;

  pg.connect(connectionString, function (err, client, done) {
    //var query = client.query("SELECT * FROM article WHERE LOWER(title) = LOWER($1)", [titleStr]);
    var query = client.query("SELECT * FROM article WHERE title = $1", [titleStr]);
    query.on('row', function (row) {
      results.push(row);
    });

    query.on('end', function () {
      client.end();
      //var unknownThumbnail = 'http://upload.wikimedia.org/wikipedia/commons/3/37/No_person.jpg';
      var unknownThumbnail = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
      var links = [];
      if (results[0] && results[0].links) {
        links = getRandomLinksFromArticle(results[0].links);
      }

      var url = 'http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=300&titles=' + req.query.title;
      request(url).then(function (rawResponse) {
        var response = rawResponse[0];

        if (response.statusCode !== 200) {
          res.json({links: links, summaryText: "", imageUrl: unknownThumbnail});//TODO pageid may still exist. Get Summary from page id at least
        }

        var imageInfo = JSON.parse(response.body);
        var pages = imageInfo.query.pages;
        var pageId;
        for (var key in pages) {
          pageId = key;
        }

        var summaryUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&pageids=' + pageId;
        request(summaryUrl).then(function (rawResponse) {
          var summaryInfo = JSON.parse(rawResponse[0].body);
          var summaryText = summaryInfo.query.pages[pageId].extract;
          var thumbnail = pages[pageId].thumbnail;
          var sourceImage;
          if (typeof thumbnail === 'undefined' || typeof thumbnail.source === 'undefined') {
            sourceImage = unknownThumbnail;
          }
          else {
            sourceImage = thumbnail.source;
          }

          res.json({links: links, imageUrl: sourceImage, summaryText: summaryText});
        });
      });
    });
  });
});

var getRandomLinksFromArticle = function(links){
  var randomLinks = [];
  var numOfLinks = links.length;
  var linkCeiling = numOfLinks < MAX_NUMBER_OF_LINKS ? numOfLinks : MAX_NUMBER_OF_LINKS;
  for(var i = 0; i < linkCeiling; i++){
    var randomLink = links.splice(Math.floor(Math.random() * links.length),1)[0];
    randomLinks.push(randomLink);
  }
  return randomLinks;
};

// remove multiple, leading or trailing spaces
function trim(s) {
  s = s.replace(/(^\s*)|(\s*$)/gi,'');
  s = s.replace(/[ ]{2,}/gi,' ');
  s = s.replace(/\n /,"\n"); return s;
}

module.exports = router;
