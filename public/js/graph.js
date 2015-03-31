/**
 * Created by david on 3/30/2015.
 */

var Node = require('./node.js');
var Edge = require('./edge.js');


function Graph() {
  this.nodes = {};
  this.edges = {};

  Graph.prototype.addNode = function (title, rid) {
    var node = new Node(title, rid);
    return this.nodes[node.name()] = node;
  };

  Graph.prototype.getNode = function (title, rid) {
    if (title in this.nodes) {
      return this.nodes[title];
    }
    //TODO call to server to find node by rid/title
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

module.exports = Graph;

