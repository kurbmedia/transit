(function() {

  Transit.template.set('transit/ui/save-button', '<button class="save btn primary"><%= text %></button>');

  Transit.template.set('transit/ui/tab-bar', '\
  <div class="navbar">\
    <div class="navbar-inner">\
      <ul class = "transit-tab-bar nav"></ul>\
    </div>\
  </div>\
');

}).call(this);