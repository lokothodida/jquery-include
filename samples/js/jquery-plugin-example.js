/**
* jQuery Plugin Example
*/
(function($, window, document) {
$.include({
  // load your plugin dependencies
  name: 'loadPluginExample',
  scope: 'global',
  scripts: [
    '//cdn.datatables.net/1.10.2/js/jquery.dataTables.min.js',
    '//cdn.jsdelivr.net/ace/1.1.5/min/ace.js',
  ],
  complete: function() {
    // your plugin definition
    $.fn.pluginExample = function() {
      console.log('loading...');
      return this.each(function() {
        var $this = $(this);
        $this.html('Changed');
      });
    };
  }
});
})(jQuery, window, document);
