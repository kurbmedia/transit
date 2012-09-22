(function() {

  Transit.Manager.prototype.template = Handlebars.compile('\
  <h1 class="header">{{heading}}</h1>\
  {{> transit_save_button}}\
');

  Transit.Toolbar.prototype.template = Handlebars.compile('\
<div class="toolbar-inner">\
    {{> transit_navbar}}\
    <div class="panels">\
    </div>\
</div>\
');

  Handlebars.registerPartial('transit_navbar', '\
<div class="navbar">\
  <div class="navbar-inner">\
    <ul class="transit-nav-bar nav">\
    </ul>\
  </div>\
</div>\
\
');

  Transit.Panel.prototype.template = Handlebars.compile('\
<div class="transit-panel" id="{{cid}}">\
</div>\
');

  Transit.Modal.prototype.template = Handlebars.compile('\
<div class="modal fade">\
  <div class="modal-header">\
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
    <h3>{{title}}</h3>\
  </div>\
  <div class="modal-body">\
    {{{content}}}\
  </div>\
  <div class="modal-footer">\
    {{#each buttons}}\
      {{> transit_button}}\
    {{/each}}\
  </div>\
</div>\
');

  Handlebars.registerPartial('transit_toolbar', Transit.Toolbar.prototype.template);

  Handlebars.registerPartial('transit_button', '\
<button class="btn {{css}}"{{#if action}} data-action="{{action}}{{/if}}">\
  {{#if icon}}\
  <i class="icon-ok"></i> \
  {{/if}}\
  {{#if text}}{{text}}{{else}}Submit{{/if}}\
</button>');

  Handlebars.registerPartial('transit_save_button', '\
<button class="save btn primary">\
  <i class="icon-ok"></i> {{#if text}}{{text}}{{else}}Save{{/if}}\
</button>');

  $.fn.modal.Constructor.prototype.removeBackdrop = function() {
    this.$backdrop.remove();
    return this.$backdrop = null;
  };

  $.fn.modal.Constructor.prototype.backdrop = function(callback) {
    var animate, doAnimate, that,
      _this = this;
    that = this;
    animate = this.$element.hasClass('fade') ? 'fade' : '';
    if (this.isShown && this.options.backdrop) {
      doAnimate = $.support.transition && animate;
      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo($('#transit_ui'));
      if (this.options.backdrop !== 'static') {
        this.$backdrop.one('click', (function() {
          return _this.hide();
        }));
      }
      if (doAnimate) {
        this.$backdrop[0].offsetWidth;
      }
      this.$backdrop.addClass('in');
      if (doAnimate) {
        this.$backdrop.one($.support.transition.end, callback);
      } else {
        callback();
      }
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');
      if ($.support.transition && this.$element.hasClass('fade')) {
        this.$backdrop.one($.support.transition.end, (function() {
          return _this.removeBackdrop();
        }));
      } else {
        this.removeBackdrop();
      }
    } else {
      if (typeof callback === "function") {
        callback();
      }
    }
    return this;
  };

}).call(this);
