(function() {
  var $, Cache, Settings, Template, Transit, setting,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

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
    template_path: '/transit/views',
    asset_path: '/transit/assets'
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
      return $.get("" + (setting('template_path')) + "/" + path, function(data) {
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

  Transit.on = Backbone.Events.on;

  Transit.trigger = Backbone.Events.trigger;

  Transit.off = Backbone.Events.off;

  Transit.one = function(events, callback, context) {
    var callone;
    callone = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      callback.apply(null, args);
      return Transit.off(events, callone, context);
    };
    return Transit.on(events, callone, context);
  };

  Transit.set = Transit.cache.set;

  Transit.get = Transit.cache.get;

  Transit.init = function(model) {
    Transit.Manager.attach(model);
    return Transit.trigger('init');
  };

  setting = function(name) {
    return Transit.settings[name];
  };

  this.Transit;

}).call(this);
(function() {
  var $, Manager, Panel, Panels,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  $ = window.$ || Backbone.$;

  /*
  
  The manager contains the global "shell" that contains
  all additional ui elements
  */


  Manager = (function(_super) {

    __extends(Manager, _super);

    function Manager() {
      this._save = __bind(this._save, this);

      this._removeTab = __bind(this._removeTab, this);

      this._addTab = __bind(this._addTab, this);

      this.show = __bind(this.show, this);

      this.setHeading = __bind(this.setHeading, this);

      this.render = __bind(this.render, this);

      this.hide = __bind(this.hide, this);
      return Manager.__super__.constructor.apply(this, arguments);
    }

    Manager.prototype.tagName = 'div';

    Manager.prototype.className = 'transit-ui';

    Manager.prototype.events = {
      'click button.save': '_save'
    };

    Manager.prototype.Panels = null;

    Manager.prototype._heading = null;

    Manager.prototype._tabbar = null;

    Manager.prototype.initialize = function() {
      Transit.one('init', this.render);
      this.Panels = new Panels();
      this.Panels.on('add', this._addTab);
      return this.Panels.on('remove', this._removeTab);
    };

    Manager.prototype.add = function() {
      var panels, _ref;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.Panels).add.apply(_ref, panels);
    };

    Manager.prototype.append = function(node) {
      return this.$el.append(node);
    };

    Manager.prototype.attach = function(model) {
      this.model = model;
      return this;
    };

    Manager.prototype.hide = function() {
      this.$el.addClass('hidden');
      $('html').addClass('transit-ui-hidden').removeClass('transit-ui-active');
      Transit.trigger('ui:hide');
      return this;
    };

    Manager.prototype.prepend = function(node) {
      return this.$el.prepend(node);
    };

    Manager.prototype.render = function() {
      if ($('#transit_ui').length === 0) {
        Manager.__super__.render.apply(this, arguments);
        $('html').addClass('transit-ui-hidden');
        this.$el.addClass('hidden').append("<h1>Title</h1>").append('<ul class="transit-tab-bar"></ul>').attr('id', 'transit_ui').appendTo($('body'));
        this.$el.append(this.Panels.render().$el);
        this._tabbar = this.$('ul.transit-tab-bar');
        this._heading = this.$('h1');
      }
      return this;
    };

    Manager.prototype.setHeading = function(text) {
      return this._heading.html(text);
    };

    Manager.prototype.show = function() {
      this.$el.removeClass('hidden');
      $('html').removeClass('transit-ui-hidden').addClass('transit-ui-active');
      Transit.trigger('ui:show');
      return this;
    };

    Manager.prototype._addTab = function(panel) {
      var _this = this;
      this._tabbar.append("      <li class='tab' id='panel_tab_" + panel.cid + "' data-panel='" + panel.cid + "'>        <a href='#', class='" + panel.icon + "' data-panel='" + panel.cid + "'>" + panel.title + "</a>      </li>");
      return this.$("a[data-panel='" + panel.cid + "']").on('click', function(event) {
        $('li.tab a', _this._tabbar).removeClass('active');
        event.preventDefault();
        return panel.trigger('active');
      });
    };

    Manager.prototype._removeTab = function(panel) {
      return $("#panel_tab_" + panel.cid).remove();
    };

    Manager.prototype._save = function(event) {
      if (event) {
        event.preventDefault();
      }
      if (!this.model) {
        return false;
      }
      return this.model.save;
    };

    return Manager;

  })(Backbone.View);

  /*
  
  The interface contains one or more panels, which are used to 
  edit / manage a deliverable and its contexts.
  */


  Panels = (function(_super) {

    __extends(Panels, _super);

    function Panels() {
      this._add = __bind(this._add, this);

      this.remove = __bind(this.remove, this);

      this.removeAll = __bind(this.removeAll, this);

      this.change = __bind(this.change, this);

      this.add = __bind(this.add, this);
      return Panels.__super__.constructor.apply(this, arguments);
    }

    Panels.prototype.tagName = 'div';

    Panels.prototype.className = 'panels';

    Panels.prototype.initialize = function() {
      this.panels = [];
      this.on('change', this.change);
      return this.add.apply(this, arguments);
    };

    Panels.prototype.add = function() {
      var panel, panels, _i, _len, _ref;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = _.flatten([panels]);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        panel = _ref[_i];
        this._add(panel);
      }
      return this;
    };

    Panels.prototype.change = function() {
      var args, current, panel, _i, _len, _ref, _results;
      current = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = this.panels;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        panel = _ref[_i];
        if (panel === current) {
          _results.push(panel.activate.apply(panel, args));
        } else {
          panel.trigger('inactive');
          _results.push(panel.deactivate.apply(panel, args));
        }
      }
      return _results;
    };

    Panels.prototype.removeAll = function() {
      return this.remove.apply(this, this.panels);
    };

    Panels.prototype.remove = function() {
      var panel, panels, _i, _len, _ref, _results;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = _.flatten([panels]);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        panel = _ref[_i];
        _results.push(panel.remove());
      }
      return _results;
    };

    Panels.prototype._add = function(panel) {
      var _this = this;
      panel.on('active', function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        $("#panel_tab_" + panel.cid).addClass('active');
        return _this.trigger.apply(_this, ['change', panel].concat(__slice.call(args)));
      });
      panel.on('remove', function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (_this.panels.indexOf(panel) !== -1) {
          _this.panels.splice(_this.panels.indexOf(panel), 1);
        }
        return _this.trigger.apply(_this, ['remove', panel].concat(__slice.call(args)));
      });
      this.panels.push(panel);
      this.trigger('add', panel);
      return this.$el.append(panel.render().$el);
    };

    return Panels;

  })(Backbone.View);

  Panel = (function(_super) {

    __extends(Panel, _super);

    function Panel() {
      return Panel.__super__.constructor.apply(this, arguments);
    }

    Panel.prototype.tagName = 'div';

    Panel.prototype.className = 'transit-panel';

    Panel.prototype.title = 'Detail';

    Panel.prototype.icon = '';

    Panel.prototype.active = false;

    Panel.prototype.initialize = function() {
      return _.bindAll(this);
    };

    Panel.prototype.activate = function() {
      this.active = true;
      return this.$el.addClass('active');
    };

    Panel.prototype.deactivate = function() {
      this.active = false;
      return this.$el.removeClass('active');
    };

    Panel.prototype.remove = function() {
      Panel.__super__.remove.apply(this, arguments);
      return this.trigger('remove', this);
    };

    return Panel;

  })(Backbone.View);

  Transit.Manager = new Manager();

  Transit.Panel = Panel;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      Panel: Panel,
      Manager: Manager
    };
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
