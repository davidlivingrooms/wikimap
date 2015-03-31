/**
 * Created by david on 3/30/2015.
 */

function Node() {

  function Node(title, rid) {
    this.title = title;
    this.id = rid;
    this.degree = 0;
  }

  Node.prototype.title = function () {
    return this.title.toString();
  };

  Node.prototype.getImage = function () {
    //TODO
  };

}

module.exports = Node;