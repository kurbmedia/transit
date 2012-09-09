(function() {
  var Transit, href, setting;

  Transit = window.Transit || {};

  Transit._settings = {
    base_path: '/transit',
    view_path: '/views'
  };

  Transit.setup = function(options) {
    if (options == null) {
      options = {};
    }
    return Transit._settings = _.extend(Transit._settings, options);
  };

  setting = function(name) {
    return Transit._settings[name];
  };

  href = function(path) {
    return "" + (setting('base_path')) + (setting('view_path'));
  };

  Transit._cache = {
    views: {}
  };

  Transit.compile = function(html) {
    return _.tpl(html);
  };

  Transit.load = function(template, callback) {
    if (Transit._cache[template] !== void 0) {
      return callback(template);
    }
    return $.get("" + (href(setting('view_path'))) + "/" + template, function(data) {
      var result;
      result = Transit.compile(data);
      Transit._cache[template] = result;
      return callback(result);
    });
  };

}).call(this);
(function() {
  var Context,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Context = (function(_super) {

    __extends(Context, _super);

    function Context() {
      return Context.__super__.constructor.apply(this, arguments);
    }

    Context.prototype.initialize = function() {};

    return Context;

  })(Backbone.Model);

  Transit.Context = Context;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Context;
  }

}).call(this);
(function() {
  var Deliverable,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Deliverable = (function(_super) {

    __extends(Deliverable, _super);

    function Deliverable() {
      this._build_contexts = __bind(this._build_contexts, this);

      this.invalidate = __bind(this.invalidate, this);
      return Deliverable.__super__.constructor.apply(this, arguments);
    }

    Deliverable.prototype.contexts = null;

    Deliverable.prototype.initialize = function() {
      this.contexts || (this.contexts = new Transit.Contexts());
      this.on('change:contexts', this._build_contexts);
      this._build_contexts();
      return this;
    };

    Deliverable.prototype.invalidate = function(model, xhr, options) {
      var attr, messages, response, _ref, _results;
      if (xhr && xhr.responseText) {
        response = $.parseJSON(xhr.responseText);
        if (response['errors']) {
          _ref = response.errors;
          _results = [];
          for (attr in _ref) {
            messages = _ref[attr];
            _results.push(model.trigger("error:" + attr, messages));
          }
          return _results;
        }
      }
    };

    Deliverable.prototype.toJSON = function() {
      var data;
      data = {};
      this.contexts.each(function(con, index) {
        return data[index.toString()] = con.toJSON();
      });
      return {
        page: _.extend(Deliverable.__super__.toJSON.apply(this, arguments), {
          contexts_attributes: data
        })
      };
    };

    Deliverable.prototype._build_contexts = function() {
      var contexts;
      contexts = this.attributes.contexts || [];
      this.contexts.reset(contexts);
      delete this.attributes['contexts'];
      return this;
    };

    return Deliverable;

  })(Backbone.Model);

  Transit.Deliverable = Deliverable;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Deliverable;
  }

}).call(this);
(function() {
  var Contexts,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Contexts = (function(_super) {

    __extends(Contexts, _super);

    function Contexts() {
      return Contexts.__super__.constructor.apply(this, arguments);
    }

    Contexts.prototype._deliverable = null;

    Contexts.prototype.model = function(data) {
      var klass;
      klass = Transit[data['_type']];
      if (klass !== void 0) {
        return new klass(data);
      } else {
        return new Transit.Context(data);
      }
    };

    return Contexts;

  })(Backbone.Collection);

  Transit.Deliverable = Deliverable;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Deliverable;
  }

}).call(this);
(function() {
  var Region,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Region = (function(_super) {

    __extends(Region, _super);

    function Region() {
      return Region.__super__.constructor.apply(this, arguments);
    }

    return Region;

  })(Backbone.View);

  Transit.views || (Transit.views = {});

  Transit.views.Region = Region;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Region;
  }

}).call(this);
