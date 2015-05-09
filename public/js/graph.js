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
    return this.nodes[node.getDomCompatibleRid()] = node;
  };

  Graph.prototype.getNode = function (title, rid, addViewNode) {
    var _this = this;
    if (rid in this.nodes) {
      return this.nodes[rid];
    }

    var promise = articlePromise(title, rid);
    return promise.then(function (data) {
      var node = _this.addNode(title, data.rid);
      node.imageUrl = data.imageUrl;
      node.pageId = data.pageId;
      addViewNode(node);

      if (typeof data.nodes !== 'undefined') {
        data.nodes.map(function (nodeObject) {
          var linkNodeObject = new Node(nodeObject.title, nodeObject.rid);
          if (node.getDomCompatibleRid() !== linkNodeObject.getDomCompatibleRid()) {
            node.links.push(nodeObject);
          }
        });
      }

      return node;
    });
  };

  Graph.prototype.addEdge = function (fromNode, toNode) {
    var edge = new Edge(fromNode.getDomCompatibleRid(), toNode.getDomCompatibleRid());
    var edgeName = edge.toString();
    if (!(edgeName in this.edges)) {
      this.edges[edgeName] = edge;
    }
    ++fromNode.degree;
    ++toNode.degree;
  };

  Graph.prototype.isFullyExpanded = function (node) {
    var _this = this;
    return node.links && node.links.every(function(element) {
     var elementNode = new Node(element.title, element.rid);
        return elementNode.getDomCompatibleRid() in _this.nodes;
    })
  };

  Graph.prototype.expandNeighbours = function (node, callback) {
    var _this = this;
    var promisesArray = node.links.map(function (nodeObject) {
      var linkNodeObject = new Node(nodeObject.title, nodeObject.rid);
      if (node.getDomCompatibleRid() !== linkNodeObject.getDomCompatibleRid()) {
        return _this.getNode(linkNodeObject.title, null, function(vertex) {
          _this.addEdge(node, vertex);
          callback(vertex);
        });
      }
    });

    return Promise.all(promisesArray);
    //TODO implement
  };
}

function articlePromise(title, rid) {
  return Promise.resolve(
    $.ajax({
      url: 'http://localhost:3000/wikimaps/getArticleInfo?title',
      data: {title: title, rid: rid},
      dataType: 'json'
    }));
}

module.exports = Graph;

