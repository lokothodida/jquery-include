/**
* Title:   jQuery Include
* Author:  Lawrence Okoth-Odida
* Version: 0.1
*/

(function($, window, document) {
var includes = [];
var totalIncludes = 0;

/** $.include() */
$.include = function(options, onComplete) {
  totalIncludes++;

  var settings = {
    name: 'include' + totalIncludes,
    scripts: [],
    scope: 'global',
    onComplete: false,
  };

  // correct the settings based on the type signature
  if (typeof onComplete !== 'undefined') {
    settings.onComplete = onComplete;
  }

  if (typeof options == 'string') {
    settings.scripts = [options];
  } else if (Array.isArray(options)) {
    settings.scripts = options;
  } else {
    settings = $.extend(settings, options);
  }

  var ajax = {};
  ajax.dataType = (settings.scope == 'global') ? 'script' : 'text';
  ajax.async = ajax.dataType === 'script';

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
      // we still have scripts to load
      var url = scripts.shift();

      $.ajax({
        url: url,
        dataType: ajax.dataType,
        async: ajax.async,
        success: function(response) {
          if (ajax.dataType == 'text') {
            scriptBody += '\n\n' + response;
          }

          scriptStatuses[url] = true;
        },
        error: function(a,b,c) {
          scriptStatuses[url] = false;
        },
        complete: function() {
          scriptStatuses.length++;
          loadScripts(scripts, scriptStatuses, scriptBody);
        }
      });
    } else {
      // all scripts have loaded
      if (ajax.dataType == 'text') {
        // evaluate the accumulating scriptBody content
        var settingsCompleteCode = getFunctionContents(settings.onComplete);

        eval(scriptBody);
        eval(settingsCompleteCode);
      } else {
        // run the complete method
        settings.onComplete();
      }

      includes.push(settings.name);

      $(document).trigger('include', [{
        name: settings.name,
        status: scriptStatuses,
      }]);
    }
  };

  loadScripts(settings.scripts.slice(0), { length: 0 }, '');

  return this;
};

/**
$(...).include()
*/

$.fn.include = function(names, callback) {
  var settings = {
    names: (typeof names === 'function') ? false : names,
    callback: (typeof callback === 'function') ? callback : names,
  };

  if (typeof settings.names === 'string') {
    settings.names = [settings.names];
  }

  var includeBlocksLoaded = function(names) {
    var status = true;
    var i = 0;

    while ((i < names.length) && status) {
      status = status && (includes.indexOf(names[i]) > -1);
      i++;
    }

    return status;
  };

  return this.each(function() {
    var includesChecked = {};

    $(this).on('include', function(event, params) {
      var name = params.name;
      var status = params.status;
      var includeCheckId = settings.names.toString();

      if (!settings.names) {
        settings.callback(name, status);
      } else if (!includesChecked[includeCheckId] && includeBlocksLoaded(settings.names)) {
        settings.callback(status);

        includesChecked[includeCheckId] = true;
      }
    });
  });
};
})(jQuery, window, document);
