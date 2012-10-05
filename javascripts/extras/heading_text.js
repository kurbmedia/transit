(function() {
  var HeadingText, HeadingView, Transit,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Transit = this.Transit || require('transit');

  HeadingText = (function(_super) {

    __extends(HeadingText, _super);

    function HeadingText() {
      return HeadingText.__super__.constructor.apply(this, arguments);
    }

    HeadingText.prototype.type = 'HeadingText';

    HeadingText.prototype.defaults = {
      node: 'h3',
      body: "Heading content",
      _type: 'HeadingText'
    };

    return HeadingText;

  })(Transit.Context);

  HeadingView = (function(_super) {

    __extends(HeadingView, _super);

    function HeadingView() {
      this.checkRemove = __bind(this.checkRemove, this);
      return HeadingView.__super__.constructor.apply(this, arguments);
    }

    HeadingView.prototype.className = 'managed-context heading-text';

    HeadingView.prototype.events = {
      'change select[name="node"]': 'swapNode',
      'click > .subhead': 'edit',
      'blur > .subhead': 'edit',
      'focusout > .subhead': 'edit',
      'keydown > .subhead': 'checkKeys',
      'click i.icon-remove': 'checkRemove'
    };

    HeadingView.prototype.afterRender = function() {
      return this.heading = this.$("> .subhead");
    };

    HeadingView.prototype.edit = function(event) {
      var div;
      div = $(event.currentTarget);
      if (event.type === 'blur' || event.type === 'focusout') {
        div.removeAttr('contenteditable');
        return this.model.set('body', div.text());
      } else {
        return div.attr('contenteditable', 'true');
      }
    };

    HeadingView.prototype.checkKeys = function(event) {
      if (event.keyCode === 13) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
      }
    };

    HeadingView.prototype.checkRemove = function(event) {
      if (confirm("Are you sure you want to remove this heading?")) {
        this.model.destroy();
        return this.close();
      }
    };

    HeadingView.prototype.swapNode = function(event) {
      var sel;
      sel = $(event.currentTarget);
      this.heading.replaceWith($("<" + (sel.val()) + "></" + (sel.val()) + ">").html(this.model.get('body')).addClass('subhead'));
      this.heading = this.$('> .subhead');
      return this;
    };

    return HeadingView;

  })(Transit.ContextView);

  Transit.set('context', 'HeadingText', HeadingText);

  HeadingView.prototype.template = Handlebars.compile('\
<{{node}} name="body" class="subhead">{{{body}}}</{{node}}>\
');

  HeadingText.prototype.view = HeadingView;

}).call(this);
