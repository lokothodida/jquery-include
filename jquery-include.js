/**
* Title:   jQuery Include
* Author:  Lawrence Okoth-Odida
* Version: 0.1
*/

(function($, window, document) {
$.fn.include = function(options) {
  /**
  * jQuery Include Default Settings
  *
  * @property settings
  * @type {Object}
  */
  var settings = $.extend({
    // ...
  }, options);

  return this.each(function() {
    // ...
  });
};
})(jQuery, window, document);

