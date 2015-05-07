/**
 * Created by david on 3/30/2015.
 */
var Promise = require('bluebird');

function Node(title, rid) {
  this.title = title;
  this.links = [];
  this.imageUrl;
  this.pageId;
  this.rid = rid;
  this.degree = 0;

  Node.prototype.getTitle = function () {
    var removedSpacesString = this.title.split(" ").join("_");
    return removedSpacesString.replace("(", "").replace(")", "");
  };

  Node.prototype.getRid = function () {
    return this.rid;
  };

  Node.prototype.getDomCompatibleRid = function () {
    var rid = this.rid;
    //return [rid.slice(0, 0), "element", rid.slice(0)].join('').replace(/:/g, '\\\\:');
    return [rid.slice(0, 0), "element", rid.slice(0)].join('').replace(/:/g, '');
  };

  Node.prototype.getImageUrl = function () {
    return this.imageUrl;
  };
}

module.exports = Node;