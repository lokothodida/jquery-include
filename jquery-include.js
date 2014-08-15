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
    name : null,
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
  * Data type for the ajax call
  *
  * @property ajaxDataType
  * @type {String}
  */
  var ajaxDataType = (settings.scope == 'global') ? 'script' : 'text';

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
          loadScripts(scripts, scriptStatuses, scriptBody);
        }
      });
    } else {
      if (ajaxDataType == 'text') {
        // evaluate the accumulating scriptBody content
        var settingsCompleteCode = getFunctionContents(settings.complete);

        eval(scriptBody);
        eval(settingsCompleteCode);
      } else {
        // run the complete method
        settings.complete();
      }

      // keep local version of completedIncludes array for the trigger
      var completed = completedIncludes.slice(0);
      completed.push(settings.name);

      $(document).trigger('includeComplete', [{
        name: settings.name,
        scripts: scriptStatuses,
        completed: completed,
      }]);

      // fix completedIncludes
      completedIncludes = completed;
    }
  };

  /**
  * Procedures
  */
  loadScripts(settings.scripts, { length: 0 }, '');

  return this;
};
})(jQuery, window, document);
