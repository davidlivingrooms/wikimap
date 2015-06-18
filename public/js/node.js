/**
 * Created by david on 3/30/2015.
 */
var Promise = require('bluebird');

function Node(title) {
  this.title = title;
  this.links = [];
  this.degree = 0;
}

module.exports = Node;