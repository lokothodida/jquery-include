/**
* Title:   jQuery Include
* Author:  Lawrence Okoth-Odida
* Version: 0.1
*/

(function($, window, document) {
$.include = function(options, callbackComplete) {
  /**
  * Check the type-signature and fix the options accordingly
  */
  if (typeof options == 'string' || Array.isArray(options)) {
    var tmpOptions = {};
    tmpOptions.scripts = Array.isArray(options) ? options : [options];

    options = tmpOptions;
  }

  if (typeof callbackComplete !== 'undefined') {
    options.complete = callbackComplete;
  }

  /**
  * jQuery Include Default Settings
  *
  * @property settings
  * @type {Object}
  */
  var settings = $.extend({
    scripts: [],
    scope: 'global',
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
  var loadScripts = function(scripts, scriptStatuses) {
    if (scripts.length) {
      var url = scripts.shift();
      var dataType = settings.scope == 'global' ? 'script' : 'text';

      $.ajax({
        url: url,
        dataType: 'script',
        success: function() {
          scriptStatuses[url] = true;
        },
        error: function() {
          scriptStatuses[url] = false;
        },
        complete: function() {
          scriptStatuses.length++;
          loadScripts(scripts, scriptStatuses);
        }
      });
    } else {
      settings.complete();
      $(document).trigger('includeComplete', [{scripts: scriptStatuses}]);
    }
  };

  /**
  * Procedures
  */
  loadScripts(settings.scripts, { length: 0 });

  return this;
};
})(jQuery, window, document);
