/**
* Title:   jQuery Include
* Author:  Lawrence Okoth-Odida
* Version: 0.1
*/

(function($, window, document) {
/**
* Keeps track of all of the 'includes' that have completed
*
* @property completedIncludes
* @type {Array}
*/
var completedIncludes = [];
var includeCount = 0;

$.include = function(options, callbackComplete) {
  includeCount++;
  var tmpSettings = {};

  /**
  * Check the type-signature and fix the options accordingly
  */
  if (typeof options == 'string') {
    tmpSettings.scripts = [options];
  } else if (Array.isArray(options)) {
    tmpSettings.scripts = options;
  } else {
    tmpSettings = options;
  }

  if (typeof callbackComplete !== 'undefined') {
    tmpSettings.onComplete = callbackComplete;
  }

  /**
  * jQuery Include Default Settings
  *
  * @property settings
  * @type {Object}
  */

  var settings = $.extend({
    name : 'include#' + includeCount,
    scripts: [],
    scope: 'local',
    onEachInclude : function (script, status) {
      // ...
    },
    onComplete : function() {
      // ...
    }
  }, tmpSettings);

  /**
  * Data type for the ajax call
  *
  * @property ajaxDataType
  * @type {String}
  */
  var ajaxDataType = (settings.scope == 'global') ? 'script' : 'text';

  /**
  * Asynchronisity for ajax call - should be false if the callback is undefined
  * and options is a string or an array
  *
  * @property ajaxDataType
  * @type {String}
  */
  var ajaxAsync = true; // typeof callbackComplete !== 'undefined' || !(typeof options == 'string' || Array.isArray(options));

  /**
  * Returns contents of a function
  *
  * @method getFunctionContents
  * @param {Function} fn
  * @returns {String} contents of the function (its body)
  */
  var getFunctionContents = function(fn) {
    var fnBody = '~~' + fn.toString() + '~~';
    return fnBody.replace('~~function () {', '').replace('}~~', '');
  };

  /**
  * Recursively loads an array of scripts in order given
  *
  * @method loadScripts
  * @param {Array} scripts URLs of the scripts to load
  * @param {Object} scriptStatuses mapping of script URLs to success statuses
  * @param {String} scriptBody accumulating content of script files to be eval'd
  */
  var loadScripts = function(scripts, scriptStatuses, scriptBody) {
    if (scripts.length) {
      var url = scripts.shift();

      $.ajax({
        url: url,
        dataType: ajaxDataType,
        async: ajaxAsync,
        success: function(response) {
          if (ajaxDataType == 'text') {
            scriptBody += '\n\n' + response;
          }

          scriptStatuses[url] = true;
        },
        error: function() {
          scriptStatuses[url] = false;
        },
        complete: function() {
          scriptStatuses.length++;
          settings.onEachInclude(url, scriptStatuses[url]);
          loadScripts(scripts, scriptStatuses, scriptBody);
        }
      });
    } else {
      if (ajaxDataType == 'text') {
        // evaluate the accumulating scriptBody content
        var settingsCompleteCode = getFunctionContents(settings.onComplete);

        eval(scriptBody);
        eval(settingsCompleteCode);
      } else {
        // run the complete method
        settings.onComplete();
      }

      // keep local version of completedIncludes array for the trigger
      var completed = completedIncludes.slice(0);
      completed.push(settings.name);

      $(document).trigger('includeComplete', [{
        name: settings.name,
        statuses: scriptStatuses,
        includes: completed,
      }]);

      // fix completedIncludes
      completedIncludes = completed;
    }
  };

  /**
  * Procedures
  */
  loadScripts(settings.scripts.slice(0), { length: 0 }, '');

  return this;
};
})(jQuery, window, document);
