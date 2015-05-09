/**
 * Created by david on 3/30/2015.
 */
function Edge(source, target) {

  this.source = source;
  this.target = target;

  Edge.prototype.toString = function () {
    return this.source + '-' + this.target;
  };
}

module.exports = Edge;
