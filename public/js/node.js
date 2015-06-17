/**
 * Created by david on 3/30/2015.
 */
var Promise = require('bluebird');
var StringUtils = new (require('./string_utils.js'));

function Node(title) {
  this.title = title;
  this.links = [];
  this.degree = 0;

  Node.prototype.getDomCompatibleTitle = function() {
    return "article" + StringUtils.encodeID(title);//TODO this needs to be added to the string utils method
  };
}

module.exports = Node;