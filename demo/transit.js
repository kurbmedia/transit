(function() {
  var Cache, Settings, Template, Transit, setting,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  Cache = (function() {

    function Cache() {
      this.drop = __bind(this.drop, this);

      this.set = __bind(this.set, this);

      this.get = __bind(this.get, this);

    }

    Cache.prototype.view = {};

    Cache.prototype.context = {};

    Cache.prototype.tpl = {};

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

    Cache.prototype.drop = function(type, name) {
      delete this[type][name];
      return this;
    };

    return Cache;

  })();

  Settings = {
    template_path: '/transit/views',
    asset_path: '/transit/assets'
  };

  Template = (function() {

    function Template() {
      this.set = __bind(this.set, this);

      this.load = __bind(this.load, this);

      this.compile = __bind(this.compile, this);

    }

    Template.prototype.compile = function(html) {
      return _.template(html);
    };

    Template.prototype.load = function(path, callback) {
      var exists,
        _this = this;
      exists = Transit.cache.get('tpl', path);
      if (exists !== void 0) {
        return callback(exists);
      }
      return $.get("" + (setting('template_path')) + "/" + path, function(data) {
        var result;
        result = _this.compile(data);
        Transit.cache.set('tpl', path, result);
        return callback(result);
      });
    };

    Template.prototype.set = function(name, html) {
      if (typeof html === 'string') {
        html = this.compile(html);
      }
      Transit.cache.set('tpl', name, html);
      return this;
    };

    return Template;

  })();

  Transit = this.Transit = {};

  Transit.cache = new Cache();

  Transit.settings = Settings;

  Transit.template = new Template();

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

  Transit.version = "0.3.0";

  setting = function(name) {
    return Transit.settings[name];
  };

  this.Transit;

}).call(this);
(function() {
  var Notify,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Notify = (function() {

    function Notify() {
      this.success = __bind(this.success, this);

      this.info = __bind(this.info, this);

      this.error = __bind(this.error, this);

    }

    Notify.prototype.error = function() {};

    Notify.prototype.info = function() {};

    Notify.prototype.success = function() {};

    return Notify;

  })();

  Transit.Notify = new Notify();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Notify;
  }

}).call(this);
(function() {
  var Uploader, XHRUploadSupport, fileApiSupport,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  XHRUploadSupport = function() {
    var xhr;
    if (XMLHttpRequest === void 0) {
      return false;
    }
    xhr = new XMLHttpRequest();
    if (xhr['upload'] === void 0) {
      return false;
    }
    return xhr.upload['onprogress'] !== void 0;
  };

  fileApiSupport = function() {
    var input;
    input = document.createElement('INPUT');
    input.type = 'file';
    return input['files'] !== void 0;
  };

  Uploader = (function(_super) {

    __extends(Uploader, _super);

    function Uploader() {
      return Uploader.__super__.constructor.apply(this, arguments);
    }

    Uploader.prototype.tagName = 'div';

    Uploader.prototype.className = 'transit-uploader';

    Uploader["native"] = XHRUploadSupport();

    return Uploader;

  })(Backbone.View);

  Transit.Uploader = Uploader;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Uploader;
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

All deliverables can contain one or more assets.
*/


(function() {
  var Asset, Assets,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Asset = (function(_super) {

    __extends(Asset, _super);

    function Asset() {
      return Asset.__super__.constructor.apply(this, arguments);
    }

    Asset.prototype.defaults = {
      deliverable_id: null,
      deliverable_type: null,
      urls: [],
      url: null,
      image: true,
      filename: null
    };

    Asset.prototype.isImage = function() {
      return this.get('image');
    };

    return Asset;

  })(Backbone.Model);

  Assets = (function(_super) {

    __extends(Assets, _super);

    function Assets() {
      return Assets.__super__.constructor.apply(this, arguments);
    }

    Assets.prototype.model = Asset;

    Assets.prototype.url = function() {
      return Transit.settings.asset_path;
    };

    Assets.prototype.fetch = function(options) {
      if (options == null) {
        options = {};
      }
      options.data = this.deliverable;
      return Backbone.Collection.prototype.fetch.apply(this, [options]);
    };

    return Assets;

  })(Backbone.Collection);

  Transit.Asset = Asset;

  Transit.Assets = Assets;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      Asset: Asset,
      Assets: Assets
    };
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

/*

The manager contains the global "shell" that contains
all additional ui elements
*/


(function() {
  var Manager,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Manager = (function(_super) {

    __extends(Manager, _super);

    function Manager() {
      this._save = __bind(this._save, this);

      this.show = __bind(this.show, this);

      this.render = __bind(this.render, this);

      this.hide = __bind(this.hide, this);
      return Manager.__super__.constructor.apply(this, arguments);
    }

    Manager.prototype.tagName = 'div';

    Manager.prototype.className = 'transit-ui';

    Manager.prototype.events = {
      'click button.save': '_save'
    };

    Manager.prototype.toolBar = null;

    Manager.prototype.initialize = function() {
      return Transit.one('init', this.render);
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
        this.$el.addClass('hidden').attr('id', 'transit_ui').appendTo($('body'));
        if (this.toolBar === null) {
          this.toolBar = Transit.Toolbar = new Transit.Toolbar();
          this.append(this.toolBar.$el);
        }
      }
      return this;
    };

    Manager.prototype.show = function() {
      this.$el.removeClass('hidden');
      $('html').removeClass('transit-ui-hidden').addClass('transit-ui-active');
      Transit.trigger('ui:show');
      return this;
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

  Transit.Manager = new Manager();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Manager;
  }

}).call(this);

/*

The Toolbar is the view that contains all of the editing / management
panels within the UI. Panels can be added/removed as necessary to extend the 
functionality of the manager.
*/


(function() {
  var TabBar, Toolbar,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Toolbar = (function(_super) {

    __extends(Toolbar, _super);

    Toolbar.prototype.panels = [];

    Toolbar.prototype.tabBar = null;

    Toolbar.prototype.heading = null;

    Toolbar.prototype.tagName = 'div';

    Toolbar.prototype.className = 'transit-toolbar';

    function Toolbar() {
      this.set = __bind(this.set, this);
      Toolbar.__super__.constructor.apply(this, arguments);
      this.$el.attr('id', 'transit_ui_toolbar');
    }

    Toolbar.prototype.initialize = function() {
      Toolbar.__super__.initialize.apply(this, arguments);
      return this.render();
    };

    Toolbar.prototype.add = function() {
      var panel, panels, _i, _len, _results,
        _this = this;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = panels.length; _i < _len; _i++) {
        panel = panels[_i];
        if (_.indexOf(this.panels, panel.cid, true) === -1) {
          this.$('div.panels').append(panel.render().$el);
          this.tabBar.append(panel.cid, panel.title);
          this.panels.push(panel.cid);
          this.panels = _.unique(this.panels);
          panel.on('active', function() {
            return _this.tabBar.find(panel.cid).find('a').click();
          });
          _results.push(panel.on('remove', function() {
            return _this.tabBar.remove(panel.cid);
          }));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Toolbar.prototype.render = function() {
      Toolbar.__super__.render.apply(this, arguments);
      if (this.tabBar === null) {
        this.tabBar = new TabBar();
      }
      this.$el.append("<h1>Title</h1>").append(this.tabBar.el).append("<div class='panels'></div>");
      this.heading = this.$('h1');
      this.tabBar.el.find('a:eq(0)').click();
      return this;
    };

    Toolbar.prototype.set = function(prop, value) {
      switch (prop) {
        case 'heading':
          this.heading.html(value);
          break;
        default:
          return false;
      }
      return true;
    };

    return Toolbar;

  })(Backbone.View);

  TabBar = (function() {

    TabBar.prototype.el = null;

    TabBar.prototype.list = null;

    TabBar.prototype.tabs = {};

    function TabBar() {
      this.remove = __bind(this.remove, this);

      this.prepend = __bind(this.prepend, this);

      this.make = __bind(this.make, this);

      this.insert = __bind(this.insert, this);

      this.find = __bind(this.find, this);

      this.change = __bind(this.change, this);

      this.append = __bind(this.append, this);

      var id, tab, _ref;
      this.tabs = {};
      this.el = $('\
      <div class="navbar">\
        <div class="navbar-inner">\
          <ul class = "transit-tab-bar nav"></ul>\
        </div>\
      </div>');
      this.list = this.el.find('ul.transit-tab-bar');
      _ref = this.tabs;
      for (id in _ref) {
        tab = _ref[id];
        this.el.append(tab);
      }
      this;

    }

    TabBar.prototype.append = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.list.append(this.make.apply(this, args));
    };

    TabBar.prototype.change = function(next) {
      $('li', this.list).removeClass('active');
      if (this.find(next) === void 0) {
        return true;
      }
      this.find(next).addClass('active');
      return this;
    };

    TabBar.prototype.find = function(id) {
      return $(this.tabs[id]);
    };

    TabBar.prototype.insert = function() {
      var args, at, item;
      at = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      item = this.make.apply(this, args);
      if (at < _.size(this.tabs)) {
        return this.el.append(item);
      }
      return this.list.find('> li').eq(at).after(item);
    };

    TabBar.prototype.make = function(id, text, options) {
      var item, link, option, value;
      if (options == null) {
        options = {};
      }
      item = $('<li></li>');
      link = $('<a></a>').text(text);
      if (this.tabs[id] !== void 0) {
        return this.tabs[id];
      }
      for (option in options) {
        value = options[option];
        switch (option) {
          case 'class':
            link.addClass(value);
            break;
          case 'icon':
            link.prepend($("<i></i>").addClass("icon-" + value));
            break;
          default:
            link.attr(option, value);
        }
      }
      link.attr({
        href: "#transit_panel_" + id,
        "data-toggle": 'tab'
      }).text(text);
      item.append(link);
      this.tabs[id] = item;
      return item;
    };

    TabBar.prototype.prepend = function(id, text, options) {
      if (options == null) {
        options = {};
      }
      return this.list.prepend(this.make(id, text, options));
    };

    TabBar.prototype.remove = function(id) {
      return this.find(id).remove();
    };

    return TabBar;

  })();

  Transit.Toolbar = Toolbar;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Toolbar;
  }

}).call(this);
(function() {
  var Panel,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Panel = (function(_super) {

    __extends(Panel, _super);

    Panel.prototype.tagName = 'div';

    Panel.prototype.className = 'transit-panel';

    Panel.prototype.title = 'Detail';

    Panel.prototype.icon = '';

    Panel.prototype.active = false;

    function Panel() {
      this.remove = __bind(this.remove, this);

      this.deactivate = __bind(this.deactivate, this);

      this.activate = __bind(this.activate, this);

      this.initialize = __bind(this.initialize, this);

      var prop, _i, _len, _ref;
      Panel.__super__.constructor.apply(this, arguments);
      _ref = ['title', 'icon'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        if (this.options[prop] !== void 0) {
          this[prop] = this.options[prop];
        }
      }
      this.$el.attr("id", "transit_panel_" + this.cid);
    }

    Panel.prototype.initialize = function() {};

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

  Transit.Panel = Panel;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Panel;
  }

}).call(this);
