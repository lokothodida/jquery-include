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
    scripts: [],
    success : function () {
      // ...
    },
    error: function () {
      // ...
    },
    complete : function() {
      // ...
    }
  }, options);

  /**
  * Recursively loads an array of scripts in order given
  *
  * @method loadScripts
  * @param {Array} scripts URLs of the scripts to load
  */
  var loadScripts = function(scripts) {
    if (scripts.length) {
      var url = scripts.shift();

      $.ajax({
        url: url,
        dataType: 'script',
        success: function() {
          loadScripts(scripts);
        },
        error: function() {
          // ...
        },
      });
    } else {
      settings.complete();
    }
  };

  return this.each(function() {
    loadScripts(settings.scripts);
  });
};
})(jQuery, window, document);

