(function() {
  var $, Cache, Settings, Template, Transit, href, setting,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = this.$ || Backbone.$;

  Cache = (function() {

    function Cache() {
      this.set = __bind(this.set, this);

      this.get = __bind(this.get, this);

    }

    Cache.prototype.view = {};

    Cache.prototype.context = {};

    Cache.prototype.get = function(type, name) {
      var found;
      type = type.toLowerCase();
      name = name.toLowerCase();
      found = this[type][name];
      if (found === void 0) {
        return null;
      } else {
        return found;
      }
    };

    Cache.prototype.set = function(type, name, obj) {
      type = type.toLowerCase();
      name = name.toLowerCase();
      return this[type][name] = obj;
    };

    return Cache;

  })();

  Settings = {
    base_path: '/transit',
    view_path: '/views'
  };

  Template = {
    _cache: {},
    compile: function(html) {
      return _.template(html);
    },
    load: function(path, callback) {
      var self;
      self = Transit.Template;
      if (self[path] !== void 0) {
        return callback(self[path]);
      }
      return $.get("" + (href(setting('view_path'))) + "/" + path, function(data) {
        var result;
        result = self.compile(data);
        self[path] = result;
        return callback(result);
      });
    },
    set: function(name, html) {
      if (typeof html === 'string') {
        return this._cache[name] = this.compile(html);
      } else {
        return this._cache[name] = html;
      }
    }
  };

  Transit = this.Transit = {};

  Transit.cache = new Cache();

  Transit.settings = Settings;

  Transit.Template = Template;

  Transit.setup = function(options) {
    if (options == null) {
      options = {};
    }
    return Transit.settings = _.extend(Transit.settings, options);
  };

  Transit.subscribe = Backbone.Events.on;

  Transit.publish = Backbone.Events.trigger;

  Transit.unsubscribe = Backbone.Events.off;

  Transit.set = Transit.cache.set;

  Transit.get = Transit.cache.get;

  this.Transit = Transit;

  setting = function(name) {
    return Transit.settings[name];
  };

  href = function(path) {
    return "" + (setting('base_path')) + (setting('view_path'));
  };

}).call(this);
(function() {
  var $, Interface, Toolbar,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = window.$ || Backbone.$;

  /*
  
  The interface contains the global "shell" that contains
  all additional ui elements
  */


  Interface = (function(_super) {

    __extends(Interface, _super);

    function Interface() {
      this.show = __bind(this.show, this);

      this.render = __bind(this.render, this);

      this.hide = __bind(this.hide, this);

      this.attach = __bind(this.attach, this);
      return Interface.__super__.constructor.apply(this, arguments);
    }

    Interface.prototype.tagName = 'div';

    Interface.prototype.className = 'transit-ui';

    Interface.prototype.Toolbar = null;

    Interface.prototype.regions = [];

    Interface.prototype.initialize = function() {
      return this.Toolbar = new Toolbar();
    };

    Interface.prototype.attach = function(model) {
      return this.model = model;
    };

    Interface.prototype.hide = function() {
      this.$el.hide();
      return this;
    };

    Interface.prototype.render = function() {
      if ($('#transit_ui').length === 0) {
        Interface.__super__.render.apply(this, arguments);
        this.$el.hide().appendTo($('body'));
      }
      return this.$el.append(this.Toolbar.render().$el);
    };

    Interface.prototype.show = function() {
      this.render();
      this.show();
      return this;
    };

    return Interface;

  })(Backbone.View);

  /*
  
  The interface includes one toolbar, which contains
  action/command buttons for the active context
  */


  Toolbar = (function(_super) {

    __extends(Toolbar, _super);

    function Toolbar() {
      this.add = __bind(this.add, this);
      return Toolbar.__super__.constructor.apply(this, arguments);
    }

    Toolbar.prototype.tagName = 'div';

    Toolbar.prototype.className = 'transit-toolbar';

    Toolbar.prototype.add = function(item) {
      this.$el.append($(item));
      return this;
    };

    return Toolbar;

  })(Backbone.View);

  Transit.UI = new Interface();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.UI;
  }

}).call(this);

/*

Context base class, all content contexts should inherit 
this model. Creates a default _type value, as well as 
sensible defaults for all models to inherit.
*/


(function() {
  var Context,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Context = (function(_super) {

    __extends(Context, _super);

    function Context() {
      this._setType = __bind(this._setType, this);

      this._cleanup = __bind(this._cleanup, this);
      return Context.__super__.constructor.apply(this, arguments);
    }

    Context.build_as = 'contexts_attributes';

    Context.prototype.view = null;

    Context.prototype.type = null;

    Context.prototype._pendingDestroy = false;

    Context.prototype.initialize = function() {
      var klass;
      this._setType();
      if (this.view === null) {
        klass = Transit.get('view', this.type);
        if (klass === null) {
          klass = Transit.get('view', 'Context');
        }
        if (this.isNew()) {
          this.view = new klass({
            model: this
          });
        } else {
          this.view = new klass({
            model: this,
            el: ".managed-context[data-context-id='\#\{@id\}']"
          });
        }
      }
      this.on('change', function(options) {
        var name, value, _ref;
        _ref = options.changes;
        for (name in _ref) {
          value = _ref[name];
          this.view.trigger("change:" + name);
        }
        return this.view.trigger('change');
      });
      this.on('destroy', this.cleanup);
      this.view.render();
      return this;
    };

    Context.prototype._cleanup = function() {
      this.view.remove();
      return delete this.view;
    };

    Context.prototype._setType = function() {
      if (this.type !== null) {
        return true;
      }
      if (!this.has('_type')) {
        this.set('_type', this.constructor.name);
      }
      return this.type = this.get('_type');
    };

    return Context;

  })(Backbone.Model);

  Transit.Context = Context;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Context;
  }

}).call(this);
(function() {
  var $, Deliverable,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = window.$ || Backbone.$;

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
      var data, result;
      data = {};
      this.contexts.each(function(con, index) {
        return data[index.toString()] = con.toJSON();
      });
      result = {};
      result["" + Transit.Contexts.build_as] = data;
      return {
        page: _.extend(Deliverable.__super__.toJSON.apply(this, arguments), result)
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
    module.exports = Transit.Deliverable;
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

    Contexts.build_as = 'contexts_attributes';

    Contexts.prototype._deliverable = null;

    Contexts.prototype.model = function(data) {
      var klass;
      klass = Transit.get('context', data['_type']);
      if (klass !== null) {
        return new klass(data);
      } else {
        return new Transit.Context(data);
      }
    };

    return Contexts;

  })(Backbone.Collection);

  Transit.Contexts = Contexts;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Contexts;
  }

}).call(this);

/*

Context view class.
*/


(function() {
  var Context,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Context = (function(_super) {

    __extends(Context, _super);

    function Context() {
      return Context.__super__.constructor.apply(this, arguments);
    }

    return Context;

  })(Backbone.View);

  Transit.set('view', 'Context', Context);

}).call(this);
