/**
 * Created by david on 3/30/2015.
 */

var Node = require('./node.js');
var Edge = require('./edge.js');
var Promise = require('bluebird');
var $ = require('jquery');

function Graph() {
  this.nodes = {};
  this.edges = {};

  Graph.prototype.addNode = function (title, rid) {
    var node = new Node(title, rid);
    return this.nodes[node.getTitle()] = node;
  };

  Graph.prototype.getNode = function (title, rid, addViewNode) {
    if (title in this.nodes) {
      return this.nodes[title];
    }

    var node = this.addNode(title, rid);
    addViewNode(node);
    return articlePromise(title, rid);
  };

  Graph.prototype.addEdge = function (fromNode, toNode) {
    var edge = new Edge(fromTitle, toTitle);
    var edgeName = edge.toString();
    if (!(edgeName in this.edges)) {
      this.edges[edgeName] = edge;
    }
    ++fromNode.degree;
    ++toNode.degree;
  };

  Graph.prototype.expandNeighbours = function (node, callback) {
    var _this = this;
    //TODO implement
  };
}

function articlePromise(title, rid) {
  return Promise.resolve(
    $.ajax({
      url: 'http://localhost:3000/wikimaps/getLinksForArticle?title',
      data: {title: title},
      dataType: 'json'
    }));
}

module.exports = Graph;

