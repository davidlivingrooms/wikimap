(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./public/js/app.js":[function(require,module,exports){
/**
 * Created by david on 11/18/14.
 */
var wikisearch = require("./wikisearch");

wikisearch.initialize();

},{"./wikisearch":"/home/david/WebstormProjects/wikimap/public/js/wikisearch.js"}],"/home/david/WebstormProjects/wikimap/public/js/wikisearch.js":[function(require,module,exports){
/**
 *
 * Created by david on 11/18/14.
 */
//Variable to hold autocomplete options
var keys;

//Load US States as options from CSV - but this can also be created dynamically
//d3.csv("states.csv",function (csv) {
//  keys=csv;
//  start();
//});

module.exports = {

  initialize: function(){
    alert("safd");
    alert(keys);
  },

  onSelect: function(title){
    alert(title);
  },

  start: function(){
    var mc = autocomplete(document.getElementById('search'))
      .keys(keys)
      .dataField("State")
      .placeHolder("Search States - Start typing here")
      .width(960)
      .height(500)
      .onSelected(onSelect)
      .render();
  }
};




},{}]},{},["./public/js/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvYXBwLmpzIiwicHVibGljL2pzL3dpa2lzZWFyY2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRhdmlkIG9uIDExLzE4LzE0LlxuICovXG52YXIgd2lraXNlYXJjaCA9IHJlcXVpcmUoXCIuL3dpa2lzZWFyY2hcIik7XG5cbndpa2lzZWFyY2guaW5pdGlhbGl6ZSgpO1xuIiwiLyoqXG4gKlxuICogQ3JlYXRlZCBieSBkYXZpZCBvbiAxMS8xOC8xNC5cbiAqL1xuLy9WYXJpYWJsZSB0byBob2xkIGF1dG9jb21wbGV0ZSBvcHRpb25zXG52YXIga2V5cztcblxuLy9Mb2FkIFVTIFN0YXRlcyBhcyBvcHRpb25zIGZyb20gQ1NWIC0gYnV0IHRoaXMgY2FuIGFsc28gYmUgY3JlYXRlZCBkeW5hbWljYWxseVxuLy9kMy5jc3YoXCJzdGF0ZXMuY3N2XCIsZnVuY3Rpb24gKGNzdikge1xuLy8gIGtleXM9Y3N2O1xuLy8gIHN0YXJ0KCk7XG4vL30pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuICAgIGFsZXJ0KFwic2FmZFwiKTtcbiAgICBhbGVydChrZXlzKTtcbiAgfSxcblxuICBvblNlbGVjdDogZnVuY3Rpb24odGl0bGUpe1xuICAgIGFsZXJ0KHRpdGxlKTtcbiAgfSxcblxuICBzdGFydDogZnVuY3Rpb24oKXtcbiAgICB2YXIgbWMgPSBhdXRvY29tcGxldGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaCcpKVxuICAgICAgLmtleXMoa2V5cylcbiAgICAgIC5kYXRhRmllbGQoXCJTdGF0ZVwiKVxuICAgICAgLnBsYWNlSG9sZGVyKFwiU2VhcmNoIFN0YXRlcyAtIFN0YXJ0IHR5cGluZyBoZXJlXCIpXG4gICAgICAud2lkdGgoOTYwKVxuICAgICAgLmhlaWdodCg1MDApXG4gICAgICAub25TZWxlY3RlZChvblNlbGVjdClcbiAgICAgIC5yZW5kZXIoKTtcbiAgfVxufTtcblxuXG5cbiJdfQ==
