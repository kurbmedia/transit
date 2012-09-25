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

    HeadingText.prototype.defaults = {
      node: 'h2',
      body: "heading text"
    };

    return HeadingText;

  })(Transit.Context);

  HeadingView = (function(_super) {

    __extends(HeadingView, _super);

    function HeadingView() {
      this.tagName = __bind(this.tagName, this);
      return HeadingView.__super__.constructor.apply(this, arguments);
    }

    HeadingView.prototype.tagName = function() {
      return this.model.get('node');
    };

    HeadingView.prototype.template = Handlebars.compile("{{body}}");

    return HeadingView;

  })(Transit.ContextView);

  Transit.Contexts.setup('HeadingText', {
    model: HeadingText,
    view: HeadingView
  });

  if (typeof module !== "undefined" && module !== null) {
    module.exports = HeadingText;
  }

}).call(this);
