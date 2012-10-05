(function() {
  var Transit,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  this.Page = (function(_super) {

    __extends(Page, _super);

    function Page() {
      return Page.__super__.constructor.apply(this, arguments);
    }

    Page.prototype.defaults = {
      title: 'The page title.',
      description: "this is a test page",
      keywords: ["awesome", "rad", "success"]
    };

    return Page;

  })(Transit.Deliverable);

}).call(this);
