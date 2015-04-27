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
    var promise = articlePromise(title, rid);
    return promise.then(function (data) {
      if (typeof data.nodes !== 'undefined') {
        data.nodes.map(function (nodeObject) {
          node.links.push(nodeObject);
        });
      }

      return node;
    });
  };

  Graph.prototype.addEdge = function (fromNode, toNode) {
    var edge = new Edge(fromNode.title, toNode.title);
    var edgeName = edge.toString();
    if (!(edgeName in this.edges)) {
      this.edges[edgeName] = edge;
    }
    ++fromNode.degree;
    ++toNode.degree;
  };

  Graph.prototype.expandNeighbours = function (node, callback) {
    var _this = this;
    var promisesArray = node.links.map(function (nodeObject) {
      if (node.title.toUpperCase() !== nodeObject.title.toUpperCase()) {
        return _this.getNode(nodeObject.title, null, function(vertex) {
          //_this.addEdge(node, new Node(nodeObject.title, null));
          _this.addEdge(node, vertex);
          callback(vertex);
        });
      }
    });

    //return Promise.resolve(promisesArray);
    return Promise.all(promisesArray);
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

