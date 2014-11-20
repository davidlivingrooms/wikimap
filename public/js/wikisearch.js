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



