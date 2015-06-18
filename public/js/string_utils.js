/**
 * Created by david on 3/30/2015.
 */

function StringUtils() {
  StringUtils.prototype.encodeID = function(s) {
    if (s==='') return '_';
    return 'article' + s.replace(/[^a-zA-Z0-9]/g, function(match) {
      return '_'+match[0].charCodeAt(0).toString(16)+'_';
    });
  };
}

module.exports = StringUtils;