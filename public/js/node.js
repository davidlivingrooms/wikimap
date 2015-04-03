/**
 * Created by david on 3/30/2015.
 */

function Node(title, rid) {
  this.title = title;
  this.links = [];
  this.id = rid;
  this.degree = 0;

  Node.prototype.getTitle = function () {
    return this.title.toString();
  };

  Node.prototype.getImage = function () {
    //TODO
  };

}

module.exports = Node;