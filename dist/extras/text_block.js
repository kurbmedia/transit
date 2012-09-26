(function() {
  var TextBlock, TextBlockView, Transit,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  TextBlock = (function(_super) {

    __extends(TextBlock, _super);

    function TextBlock() {
      return TextBlock.__super__.constructor.apply(this, arguments);
    }

    TextBlock.prototype.defaults = {
      body: "heading text"
    };

    return TextBlock;

  })(Transit.Context);

  TextBlockView = (function(_super) {

    __extends(TextBlockView, _super);

    function TextBlockView() {
      return TextBlockView.__super__.constructor.apply(this, arguments);
    }

    TextBlockView.prototype.template = Handlebars.compile("{{{body}}}");

    return TextBlockView;

  })(Transit.ContextView);

  TextBlock.prototype.view = TextBlockView;

  Transit.set('context', 'TextBlock', TextBlock);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = TextBlock;
  }

}).call(this);
