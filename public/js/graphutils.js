/**
 * Created by david on 3/26/2015.
 */
var $ = require('jquery');

var nodes = [];
var edges = [];

module.exports = {
  getNode: function(rootTitle) {
    return Promise.resolve(
      $.ajax({
        url: 'http://localhost:3000/wikimaps/getLinksForArticle?title',
        data: {title: rootTitle},
        dataType: 'json'
      }));
  },
  expandNeighbours: function(nodeTitle) {
    return Promise.resolve(
      $.ajax({
        url: 'http://localhost:3000/wikimaps/getLinksForArticle?title',
        data: {title: rootTitle},
        dataType: 'json'
      }));
  }
}