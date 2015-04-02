/**
 * Created by david on 3/30/2015.
 */
function Edge() {

  function Edge(source, target) {
    this.source = source;
    this.target = target;
  }

  Edge.prototype.title = function () {
    return this.title.toString();
  };

  Edge.prototype.toString = function () {
    return this.source + '-' + this.target;
  };
}

module.exports = Edge;
