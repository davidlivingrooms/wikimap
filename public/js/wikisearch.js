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
    $('.img-thumbnail').hide();
    // Instantiate the Bloodhound suggestion engine
    var articles = new Bloodhound({
      datumTokenizer: function (datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: 'http://wikigrapher.com/wikimaps/findArticles?title=%QUERY',
        filter: function (articles) {
          // Map the remote source JSsON array to a JavaScript array
          return $.map(articles, function (article) {
            return {
              value: article.title
            };
          });
        },
        ajax: {
          beforeSend: function(){$('.typeahead').addClass('loading');},
          complete: function(){
            $('.typeahead').removeClass('loading');
          }
        },
        rateLimitWait: 500
      },
      limit: 10
    });

    articles.initialize();

    // Instantiate the Typeahead UI
    $('.typeahead').typeahead(null, {
      displayKey: 'value',
      source: articles.ttAdapter()
    })
      .bind('typeahead:selected', function(obj, selectedArticle) {
        WikiGraph.initializeNewGraph(selectedArticle);
      })
      .off('blur');
  }
};



