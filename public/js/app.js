/**
 * Created by david on 11/18/14.
 */
var wikisearch = require("./wikisearch");
var domready = require("domready");
var WikiGraph = require("./wikigraph");

domready(function(){
    wikisearch.initialize();
    WikiGraph.initializeNewGraph({value : "Brenton Wood"});
});
