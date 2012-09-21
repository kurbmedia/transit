(function() {

  Transit.Manager.prototype.template = Handlebars.compile('');

  Transit.Toolbar.prototype.template = Handlebars.compile('\
<div class="toolbar-inner">\
  <h1 class="header">{{heading}}</h1>\
    {{> transit_navbar}}\
    <div class="panels">\
        \
    </div>\
</div>\
');

  Transit.Toolbar.TabBar.prototype.template = Handlebars.compile('\
<div class="navbar">\
  <div class="navbar-inner">\
    <ul class="transit-nav-bar nav">\
    </ul>\
  </div>\
</div>\
');

  Transit.Panel.prototype.template = Handlebars.compile('<div class="transit-panel" id="{{cid}}"></div>');

  Handlebars.registerPartial('transit_toolbar', Transit.Toolbar.prototype.template);

  Handlebars.registerPartial('transit_save_button', '<button class="save btn primary"><i class="icon-ok"></i> {{text}}</button>');

  Handlebars.registerPartial('transit_navbar', Transit.Toolbar.TabBar.prototype.template);

}).call(this);
