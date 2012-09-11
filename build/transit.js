(function() {
  var Cache, Settings, Template, Transit, setting, _ready,
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
      this._pathify = __bind(this._pathify, this);

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
      return $.get(this._pathify(path), function(data) {
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

    Template.prototype._pathify = function(path) {
      if (path.indexOf(setting('template_path')) !== -1) {
        return path;
      } else {
        return "" + (setting('template_path')) + "/" + (path.replace(/^\//, ''));
      }
    };

    return Template;

  })();

  Transit = this.Transit = {};

  Transit.cache = new Cache();

  Transit.config = Settings;

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

  _ready = false;

  jQuery(window).one('load', function() {
    _ready = true;
    return Transit.trigger("ready");
  });

  Transit.ready = function(callback) {
    return Transit.one('ready', callback);
  };

  Transit.init = function(model) {
    Transit.Manager.attach(model);
    return Transit.trigger('init');
  };

  Transit.version = "0.3.0";

  setting = function(name) {
    return Transit.config[name];
  };

  this.Transit;

}).call(this);
(function() {
  var Notify,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Notify = (function() {

    Notify.prototype.template = function() {};

    function Notify() {
      this._setup = __bind(this._setup, this);

      this._render = __bind(this._render, this);

      this.success = __bind(this.success, this);

      this.info = __bind(this.info, this);

      this.error = __bind(this.error, this);
      Transit.one('ready', this._setup);
    }

    Notify.prototype.error = function(message) {
      return this._render(message, 'error');
    };

    Notify.prototype.info = function(message) {
      return this._render(message, 'info');
    };

    Notify.prototype.success = function(message) {
      return this._render(message, 'success');
    };

    Notify.prototype._render = function(message, type) {
      return Transit.Manager.append($(this.template({
        message: message,
        type: type
      })));
    };

    Notify.prototype._setup = function() {
      var _this = this;
      return Transit.template.load("/transit/views/core/notification.jst", function(templ) {
        return _this.template = templ;
      });
    };

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

 Selection support, provided to make working with selections and 
 ranges easier.
*/


(function() {
  var Selector;

  Selector = (function() {

    Selector.selection = null;

    function Selector() {
      _.bindAll(this);
    }

    Selector.prototype.cursor = function() {
      var marker, nrange, position, range;
      range = this.get();
      if (range === null) {
        return null;
      }
      marker = $("<span/>");
      nrange = document.createRange();
      nrange.setStart(range.endContainer, range.endOffset);
      nrange.insertNode(marker.get(0));
      position = marker.offset();
      marker.remove();
      return position;
    };

    Selector.prototype.get = function() {
      var internal, selection;
      selection = null;
      if (window.getSelection) {
        internal = window.getSelection();
        selection = internal.rangeCount > 0 ? internal.getRangeAt(0) : null;
      } else if (document.selection && document.selection.createRange) {
        selection = document.selection.createRange();
      }
      return selection;
    };

    Selector.prototype.restore = function(sel) {
      var internal;
      if (sel == null) {
        sel = null;
      }
      if (sel === null) {
        sel = this.selection;
      }
      if (sel === null) {
        return true;
      }
      if (window.getSelection) {
        internal = window.getSelection();
        internal.removeAllRanges();
        internal.addRange(sel);
      } else if (document.selection && sel.select) {
        sel.select();
      }
      this.selection = null;
      return this;
    };

    Selector.prototype.save = function() {
      this.selection = this.get();
      return this.selection;
    };

    return Selector;

  })();

  Transit.Selection = new Selector();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Selection;
  }

}).call(this);
(function() {
  var Browser, agent;

  agent = navigator.userAgent;

  Browser = {
    msie: agent.indexOf("MSIE") !== -1 && agent.indexOf("Opera") === -1,
    gecko: agent.indexOf("Gecko") !== -1 && agent.indexOf("KHTML") === -1,
    webkit: agent.indexOf("AppleWebKit/") !== -1,
    chrome: agent.indexOf("Chrome/") !== -1,
    opera: agent.indexOf("Opera/") !== -1,
    ios: /ipad|iphone|ipod/i.test(agent),
    android: /android (\d+)/i.test(agent)
  };

  Transit.browser = Browser;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.browser;
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

    Toolbar.prototype.panels = {};

    Toolbar.prototype.tabBar = null;

    Toolbar.prototype.heading = null;

    Toolbar.prototype.tagName = 'div';

    Toolbar.prototype.className = 'transit-toolbar';

    function Toolbar() {
      this.set = __bind(this.set, this);

      this.reset = __bind(this.reset, this);

      this.remove = __bind(this.remove, this);
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
        if (_.has(this.panels, panel.cid) !== true) {
          this.$('div.panels').append(panel.render().$el);
          this.tabBar.append(panel);
          this.panels[panel.cid] = panel;
          panel.on('active', function() {
            return _this.tabBar.find(panel.cid).find('a').click();
          });
          panel.on('remove', function() {
            _this.tabBar.remove(panel.cid);
            return Transit.trigger("panel:removed", panel);
          });
          _results.push(Transit.trigger("panel:added", panel));
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
      this.$el.wrapInner("<div class='toolbar-inner'></div>");
      this.heading = this.$('h1');
      this.tabBar.el.find('a:eq(0)').click();
      return this;
    };

    Toolbar.prototype.remove = function(panel) {
      if (_.isString(panel)) {
        panel = this.panels[panel];
      }
      if (panel === void 0) {
        return false;
      }
      panel.remove();
      delete this.panels[panel.cid];
      return panel;
    };

    Toolbar.prototype.reset = function() {
      var cid, panel, _ref;
      _ref = this.panels;
      for (cid in _ref) {
        panel = _ref[cid];
        panel.remove();
        delete this.panels[cid];
      }
      return this.panels = {};
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

      var _this = this;
      this.tabs = {};
      Transit.template.load('/transit/views/core/tab-bar.jst', function(templ) {
        var id, tab, _ref, _results;
        _this.el = $(templ());
        _this.list = _this.el.find('ul.transit-tab-bar');
        _ref = _this.tabs;
        _results = [];
        for (id in _ref) {
          tab = _ref[id];
          _results.push(_this.el.append(tab));
        }
        return _results;
      });
      this;

    }

    TabBar.prototype.append = function(panel) {
      return this.list.append(this.make(panel));
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

    TabBar.prototype.insert = function(at, panel) {
      var item;
      item = this.make(panel);
      if (at < _.size(this.tabs)) {
        return this.el.append(item);
      }
      return this.list.find('> li').eq(at).after(item);
    };

    TabBar.prototype.make = function(panel) {
      var id, item, link, option, options, text, value;
      id = panel.cid;
      text = panel.title;
      item = $('<li></li>');
      link = $('<a></a>').text(text);
      options = _.pick(panel, 'class', 'icon', 'id', 'href', 'rel', 'target');
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
      if (panel.$el.attr("id") === void 0) {
        panel.$el.attr('id', "#transit_panel_" + cid);
      }
      link.attr({
        href: panel.$el.attr('id'),
        "data-toggle": 'tab'
      }).text(text);
      item.append(link).attr({
        id: "#transit_panel_tab_" + id
      });
      this.tabs[id] = item;
      return item;
    };

    TabBar.prototype.prepend = function(panel) {
      return this.list.prepend(this.make(panel));
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
      if (this.$el.attr('id') === void 0) {
        this.$el.attr("id", "transit_panel_" + this.cid);
      }
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
(function() {
  var AssetManager,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AssetManager = (function(_super) {

    __extends(AssetManager, _super);

    function AssetManager() {
      this.render = __bind(this.render, this);
      return AssetManager.__super__.constructor.apply(this, arguments);
    }

    AssetManager.prototype.uploader = null;

    AssetManager.prototype.collection = null;

    AssetManager.prototype.render = function() {
      AssetManager.__super__.render.apply(this, arguments);
      this.$el.addClass('transit-asset-manager');
      if (this.uploader === null) {
        this.uploader = new Transit.Uploader();
        return this.$el.prepend(this.uploader.render().$el);
      }
    };

    return AssetManager;

  })(Transit.Panel);

  Transit.AssetManager = AssetManager;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.AssetManager;
  }

}).call(this);
