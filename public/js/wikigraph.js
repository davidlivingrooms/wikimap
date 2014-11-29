/**
 * Created by salasd1 on 11/24/2014.
 */
var d3 = require("d3-browserify");
var $ = require('jquery');
var Promise = require('bluebird');
var graph;

module.exports = {
  initializeNewGraph: function(rootTitle) {
    d3.select("svg").remove();
    drawGraph(rootTitle);
  }
}

function keepNodesOnTop() {
  $(".nodeStrokeClass").each(function (index) {
    var gnode = this.parentNode;
    gnode.parentNode.appendChild(gnode);
  });
}

function drawGraph(rootTitle) {
  graph = new wikiGraph("#svgdiv");
  graph.addWikiLinksToGraph(rootTitle, graph);
}

function wikiGraph()
{
  //var nodes = [];
  var links = [];
  this.addWikiLinksToGraph = function (rootTitle) {
    var res = Promise.resolve(
      $.ajax({
        url: 'http://localhost:3000/wikimaps/generateWikiMap?title',
        data: {title: rootTitle},
        dataType: 'json'
      }));

    res.then(function(data){
      console.log(data);
      links = data.links;
      start();
      keepNodesOnTop();
    });
  }
  // Add and remove elements on the graph object
  this.addNode = function (id) {
    nodes.push({"id": id});
    update();
  };

  this.removeNode = function (id) {
    var i = 0;
    var n = findNode(id);
    while (i < links.length) {
      if ((links[i]['source'] == n) || (links[i]['target'] == n)) {
        links.splice(i, 1);
      }
      else i++;
    }
    nodes.splice(findNodeIndex(id), 1);
    update();
  };

  this.removeLink = function (source, target) {
    for (var i = 0; i < links.length; i++) {
      if (links[i].source.id == source && links[i].target.id == target) {
        links.splice(i, 1);
        break;
      }
    }
    update();
  };

  this.removeallLinks = function () {
    links.splice(0, links.length);
    update();
  };

  this.removeAllNodes = function () {
    nodes.splice(0, links.length);
    update();
  };

  this.addLink = function (source, target, value) {
    links.push({"source": findNode(source), "target": findNode(target), "value": value});
    update();
  };

  var findNode = function (id) {
    for (var i in nodes) {
      if (nodes[i]["id"] === id) return nodes[i];
    }
  };

  var findNodeIndex = function (id) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id == id) {
        return i;
      }
    }
    ;
  };

  var start = function() {
    // set up the D3 visualisation in the specified element
    var w = 960,
      h = 450;

    var color = d3.scale.category10();

    var vis = d3.select("#chart")
      .append("svg:svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("id", "svg")
      .attr("pointer-events", "all")
      .attr("viewBox", "0 0 " + w + " " + h)
      .attr("perserveAspectRatio", "xMinYMid")
      .append('svg:g');

    var force = d3.layout.force();

    var nodes = {};

    links.forEach(function(link) {
      link.source = nodes[link.source] ||
      (nodes[link.source] = {id: link.source, title: link.sourceName});
      link.target = nodes[link.target] ||
      (nodes[link.target] = {id: link.target, title: link.targetName});
      link.value = +link.value;
    });

    force.nodes(d3.values(nodes));
    force.links(links);
    var update = function () {
      var link = vis.selectAll("line")
        .data(links, function (d) {
          return d.source.id + "-" + d.target.id;
        });

      link.enter().append("line")
        .attr("id", function (d) {
          return d.source.id + "-" + d.target.id;
        })
        .attr("stroke-width", function (d) {
          return d.value / 10;
        })
        .attr("class", "link");
      link.append("title")
        .text(function (d) {
          return d.value;
        });
      link.exit().remove();

      var node = vis.selectAll(".node")
        .data(force.nodes());

      var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .call(force.drag);

      nodeEnter.append("svg:circle")
        .attr("r", 12)
        .attr("id", function (d) {
          return "Node;" + d.id;
        })
        .attr("class", "nodeStrokeClass")
        .attr("fill", function (d) {
          return color(d.id);
        });

      nodeEnter.append("svg:text")
        .attr("class", "textClass")
        .attr("x", 14)
        .attr("y", ".31em")
        .text(function (d) {
          return d.title;
        });

      node.exit().remove();

      force.on("tick", function () {

        node.attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

        link.attr("x1", function (d) {
          return d.source.x;
        })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });
      });

      // Restart the force layout.
      force
        .gravity(.01)
        .charge(-80000)
        .friction(0)
        .linkDistance(function (d) {
          return d.value * 10
        })
        .size([w, h])
        .start();
    };

    // Make it all go
    update();
  }
}
