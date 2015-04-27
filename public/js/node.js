/**
 * Created by david on 3/30/2015.
 */
var Promise = require('bluebird');

function Node(title, rid) {
  this.title = title;
  this.links = [];
  this.imageUrl;
  this.id = rid;
  this.degree = 0;

  Node.prototype.getTitle = function () {
    return this.title;
  };

  Node.prototype.getImageUrl = function () {
    var _this = this;
    var images = getImagePromise(this.title);

    //images.then(function(rawImageData) {
    //  debugger;
    //});
  };

  var getImagePromise = function (title) {
    //TODO query for page id first then use  http://en.wikipedia.org/w/api.php?action=query&pageids=43273&prop=pageimages&format=xml&pilimit=2
      $.ajax({
        //url: 'http://en.wikipedia.org/w/api.php?action=query&titles=Albert%20Einstein&prop=pageimages&format=json&pithumbsize=100',
        url: 'http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=100',
        data: {titles: title},
        dataType: 'json'
      }).done(function(rawImagedata) {
        debugger;
      });
  };

  //var getImagePromise = function (title) {
  //  return Promise.resolve(
  //    $.ajax({
  //      //url: 'http://en.wikipedia.org/w/api.php?action=query&titles=Albert%20Einstein&prop=pageimages&format=json&pithumbsize=100',
  //      url: 'http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=100',
  //      data: {titles: title},
  //      dataType: 'json'
  //    }));
  //};
}

module.exports = Node;