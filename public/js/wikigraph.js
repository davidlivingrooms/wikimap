/**
 * Created by salasd1 on 11/24/2014.
 */
var Wave = require('loading-wave');
var $ = require('jquery');
var d3 = require('d3');
var cola = require('cola');
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
  var links = [];
  this.addWikiLinksToGraph = function (rootTitle) {
    var res = Promise.resolve(
      $.ajax({
        url: 'http://localhost:3000/wikimaps/generateWikiMap?title',
        data: {title: rootTitle},
        dataType: 'json'
      }));

    var wave = Wave({
      width: 300,
      height: 50,
      n: 10,
      color: 'steelblue'
    })

    $("#loadingAnimation").append(wave.el);

    wave.start();
    res.then(function(data){
      wave.stop();
      $("#loadingAnimation").remove();
      links = data.links;
      start();
      keepNodesOnTop();
    });
  }

  var start = function() {
    // set up the D3 visualisation in the specified element
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var active = d3.select(null);

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

    var g = vis.append("g");

    vis.on("click", stopped, true);

    var force = cola.d3adaptor()
      .linkDistance(30)
      .size([w, h]);

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

      var link = g.selectAll("line")
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

      var node = g.selectAll(".node")
        .data(force.nodes());

        var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .call(force.drag);

      nodeEnter.on("click", clicked);

      nodeEnter.append("svg:circle")
        .attr("r", 8)
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

      var zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

      vis.call(zoom) // delete this line to disable free zooming
        .call(zoom.event);

      function zoomed() {
        g.style("stroke-width", 1.5 / d3.event.scale + "px");
        g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }

      function clicked(d) {
        if (active.node() === this) return reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var x = d.px;
        var y = d.py;
        var scale = 2 / Math.max(d.px / w, d.py / h);
        var translate = [w / 2 - scale * x, h / 2 - scale * y];

        vis.transition()
          .duration(750)
          .call(zoom.translate(translate).scale(scale).event);
      }

      function reset() {
        active.classed("active", false);
        active = d3.select(null);

        vis.transition()
          .duration(750)
          .call(zoom.translate([0, 0]).scale(1).event);
      }

      function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
      }

      node.exit().remove();

      force.on("tick", function () {

        nodes[0].x = w / 2;
        nodes[0].y = h / 2;

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

    //Start the layout
    force
      .linkDistance(50)
      .avoidOverlaps(true)
      .start();

  }
}
