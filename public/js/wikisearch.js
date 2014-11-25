/**
 *
 * Created by david on 11/18/14.
 */
var Bloodhound = require("./libs/typeahead.js/bloodhound");
var $ = require('jquery');
var WikiGraph = require("./wikigraph");
window.jQuery = $; // hack to make typeahead work
require('typeahead.js');

module.exports = {

  initialize: function(){
    // Instantiate the Bloodhound suggestion engine
    var articles = new Bloodhound({
      datumTokenizer: function (datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: 'http://localhost:3000/wikimaps/findArticles?title=%QUERY',
        filter: function (articles) {
          // Map the remote source JSON array to a JavaScript array
          return $.map(articles, function (article) {
            return {
              value: article.title
            };
          });
        }
      }
    });

    articles.initialize();

    // Instantiate the Typeahead UI
    $('.typeahead').typeahead(null, {
      displayKey: 'value',
      source: articles.ttAdapter()
    })
    .bind('typeahead:selected', function(obj, selected, name) {
      WikiGraph.addNodes();
      //WikiGraph.addNodes(selected.value);
    })
    .off('blur');
  }
};



