(function() {
  var Backbone, Interface, Transit, klass, layout, renderer, _, _base, _i, _len, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Backbone = this.Backbone || require('backbone');

  _ = this._ || require('underscore');

  Transit = null;

  Backbone.Events.one = function(events, callback, context) {
    var bindCallback;
    bindCallback = _.bind(function() {
      this.unbind(events, bindCallback);
      return callback.apply(context || this, arguments);
    }, this);
    return this.bind(events, bindCallback);
  };

  _ref = [Backbone.Model, Backbone.View, Backbone.Collection];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    klass = _ref[_i];
    (_base = klass.prototype).one || (_base.one = Backbone.Events.one);
  }

  Transit = (function(_super) {

    __extends(Transit, _super);

    function Transit() {
      return Transit.__super__.constructor.apply(this, arguments);
    }

    Transit.prototype.version = "0.3.0";

    Transit.prototype.one = Backbone.Events.one;

    return Transit;

  })(Backbone.Marionette.Application);

  Transit = new Transit();

  Transit.manage = function(model, callback) {
    var manager;
    manager = new Transit.Manager({
      model: model
    });
    layout.manager.show(manager);
    this.vent.trigger('manage', model, manager);
    if (typeof callback === "function") {
      callback(manager);
    }
    return manager;
  };

  Interface = (function(_super) {

    __extends(Interface, _super);

    function Interface() {
      return Interface.__super__.constructor.apply(this, arguments);
    }

    Interface.prototype.tagName = 'div';

    Interface.prototype.className = 'transit-ui';

    Interface.prototype.id = 'transit_ui';

    Interface.prototype.template = _.template('<div id="transit_manager"></div>');

    Interface.prototype.regions = {
      manager: '#transit_manager'
    };

    return Interface;

  })(Backbone.Marionette.Layout);

  layout = null;

  /*---------------------------------------
    Initializers
  ---------------------------------------
  */


  Transit.addInitializer(function(options) {
    if (options == null) {
      options = {};
    }
    layout = new Interface();
    layout.render();
    return $('body').append(layout.el);
  });

  /*---------------------------------------
   Template fixes
  ---------------------------------------
  */


  renderer = Backbone.Marionette.Renderer.render;

  Backbone.Marionette.Renderer.render = function(template, data) {
    if (_.isFunction(template)) {
      return template(data);
    }
    if (_.isObject(template) && template.type === 'handlebars') {
      template.template(_.extend(data, template.data), template.options);
    }
    return renderer(template, data);
  };

  /*---------------------------------------
   Exports
  ---------------------------------------
  */


  this.Transit || (this.Transit = Transit);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit;
  }

}).call(this);
(function() {
  var Browser, Transit, agent;

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

  Transit = this.Transit || require('transit');

  Transit.browser = this.Transit.browser = Browser;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.browser;
  }

}).call(this);
(function() {
  var Selector, Transit;

  Transit = this.Transit || require('transit');

  Selector = (function() {

    Selector.prototype.selection = null;

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

  Transit.Selection = this.Transit.Selection = new Selector();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Selection;
  }

}).call(this);
(function() {
  var Transit,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Transit = this.Transit || require('transit');

  Transit.Template = (function() {

    Template.cache = {};

    Template.compile = function(html) {
      return _.template(html);
    };

    Template.find = function(path) {
      var found;
      found = Template.cache[Template.pathify(path)];
      if (found === void 0) {
        return false;
      } else {
        return found;
      }
    };

    Template.pathify = function(path) {
      if (path.indexOf(this.url) !== -1) {
        return path;
      } else {
        return "" + this.url + "/" + (path.replace(/^\//, ''));
      }
    };

    Template.set = function(path, html) {
      var func, template;
      path = Template.pathify(path);
      func = Template.compile(html);
      template = new Transit.Template(path, html, func);
      Template.cache[path] = template;
      return template;
    };

    Template.url = '/transit/views';

    Template.prototype.path = '';

    Template.prototype.source = "";

    Template.prototype.func = null;

    function Template(path, html, func) {
      this.render = __bind(this.render, this);
      this.path = path;
      this.source = html;
      this.func = func;
      this;

    }

    Template.prototype.render = function(data) {
      if (this.func === null) {
        return this.source;
      }
      return this.func(data);
    };

    return Template;

  }).call(this);

  Transit.tpl = function(path, callback) {
    var existing;
    path = Transit.Template.pathify(path);
    existing = Transit.Template.find(path);
    if (existing === false) {
      return $.get(path, function(data) {
        var template;
        template = Transit.Template.set(path, data);
        return callback(template);
      });
    } else {
      return callback(existing);
    }
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = {
      tpl: Transit.tpl,
      Template: Transit.Template
    };
  }

}).call(this);
(function() {
  var Transit,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Transit = this.Transit || require('transit');

  Transit.Manager = (function(_super) {

    __extends(Manager, _super);

    function Manager() {
      this.onRender = __bind(this.onRender, this);
      return Manager.__super__.constructor.apply(this, arguments);
    }

    Manager.prototype.className = 'transit-manager';

    Manager.prototype.toolBar = null;

    Manager.prototype.ui = {
      heading: 'h1'
    };

    Manager.prototype.events = {
      'click button.save': 'save'
    };

    Manager.prototype.templateHelpers = function() {
      var options;
      options = {
        heading: "Manage " + this.model.type
      };
      return options;
    };

    Manager.prototype.initialize = function() {
      return this.render();
    };

    Manager.prototype.add = function() {
      var panels, _ref;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.toolBar).add.apply(_ref, panels);
    };

    Manager.prototype.onRender = function() {
      this.toolBar = new Transit.Toolbar();
      this.on('close', this.toolBar.close);
      return this.$el.append(this.toolBar.el);
    };

    Manager.prototype.drop = function(panel) {
      return this.toolBar.drop(panel);
    };

    Manager.prototype.save = function() {
      return this.model.save();
    };

    return Manager;

  })(Backbone.Marionette.Layout);

  this.Transit.Manager = Transit.Manager;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Manager;
  }

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Transit.Modal = (function(_super) {

    __extends(Modal, _super);

    function Modal() {
      this.render = __bind(this.render, this);

      this.perform = __bind(this.perform, this);

      this.close = __bind(this.close, this);
      return Modal.__super__.constructor.apply(this, arguments);
    }

    Modal.prototype.handler = function() {
      var _this = this;
      this.$el.modal({
        show: true
      }).one('hidden', function(event) {
        Transit.vent.trigger('modal:close', _this);
        return _this.trigger('close');
      });
      return this.one('modal:close', function() {
        return _this.$el.modal('hide');
      });
    };

    Modal.prototype.tagName = 'div';

    Modal.prototype.className = 'transit-modal';

    Modal.prototype.events = {
      'click a[data-action],button[data-action]': 'perform'
    };

    Modal.prototype.initialize = function() {
      Modal.__super__.initialize.apply(this, arguments);
      this.on('close', this.remove, this);
      return this.options = _.defaults(this.options, {
        buttons: [],
        title: "Title Missing",
        content: "Content missing"
      });
    };

    Modal.prototype.close = function() {
      this.$el.trigger('hidden');
      this.remove();
      return this;
    };

    Modal.prototype.perform = function(event) {
      var acts, link;
      event.preventDefault();
      link = $(event.currentTarget);
      acts = link.attr('data-action');
      Transit.vent.trigger('modal:action', acts, this);
      if (acts === 'close') {
        return this.trigger('modal:close');
      }
    };

    Modal.prototype.remove = function() {
      this.off();
      this.trigger('remove');
      return Modal.__super__.remove.apply(this, arguments);
    };

    Modal.prototype.render = function() {
      var modal;
      modal = $(this.template(this.options));
      modal.attr('id', "transit_modal_" + this.cid);
      $('#transit_ui').append(modal);
      this.setElement($("#transit_modal_" + this.cid));
      this.trigger('open');
      Transit.vent.trigger('modal:show', this);
      this.$el.addClass('out');
      this.handler.apply(this);
      this.$el.removeClass('out').addClass('in');
      return this;
    };

    return Modal;

  })(Backbone.View);

  this.Transit.modal = function(options) {
    var view;
    if (options == null) {
      options = {};
    }
    view = new Transit.Modal(options);
    Transit.one('modal:show', function(mod) {
      if (mod !== view) {
        return false;
      }
    });
    view.render();
    return view;
  };

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
      return Transit.tpl("/core/notification.jst", function(templ) {
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
  var Transit,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  Transit.Panel = (function(_super) {

    __extends(Panel, _super);

    Panel.prototype.tagName = 'div';

    Panel.prototype.className = 'transit-panel';

    Panel.prototype.title = 'Detail';

    Panel.prototype.icon = '';

    Panel.prototype.active = false;

    function Panel() {
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

    return Panel;

  })(Backbone.Marionette.ItemView);

  this.Transit.Panel = Transit.Panel;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Panel;
  }

}).call(this);
(function() {
  var Tab, Transit,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Transit = this.Transit || require('transit');

  /*
  
  The Toolbar is the view that contains all of the editing / management
  panels within the UI. Panels can be added/removed as necessary to extend the 
  functionality of the manager.
  */


  Transit.Toolbar = (function(_super) {

    __extends(Toolbar, _super);

    function Toolbar() {
      this.reset = __bind(this.reset, this);

      this.drop = __bind(this.drop, this);

      this.add = __bind(this.add, this);
      return Toolbar.__super__.constructor.apply(this, arguments);
    }

    Toolbar.prototype.tagName = 'div';

    Toolbar.prototype.className = 'transit-toolbar';

    Toolbar.prototype.navbar = null;

    Toolbar.prototype.regions = {
      panels: 'div.panels:eq(0)'
    };

    Toolbar.prototype.events = {
      "click ul.transit-nav-bar a": 'change'
    };

    Toolbar.prototype.views = {};

    Toolbar.prototype.initialize = function() {
      return this.render();
    };

    Toolbar.prototype.add = function() {
      var panel, panels, self, _i, _len;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      self = this;
      for (_i = 0, _len = panels.length; _i < _len; _i++) {
        panel = panels[_i];
        if (!_.has(this.views, panel.cid)) {
          this.navbar.append(Tab(panel));
          this.panels.attachView(panel);
          this.views[panel.cid] = panel;
        }
      }
      if ($('> li.active', this.navbar).length === 0) {
        return $('a:eq(0)', this.navbar).click();
      }
    };

    Toolbar.prototype.change = function(event) {
      var link;
      event.preventDefault();
      this.navbar.find('li').removeClass('active');
      link = $(event.currentTarget);
      link.parent('li').addClass('active');
      return this.panels.show(this.views[link.data('transit.panel_id')]);
    };

    Toolbar.prototype.drop = function(panel) {
      panel.close();
      delete this.views[panel.cid];
      $("li[rel='" + panel.cid + "']", this.navbar).off().remove();
      return panel = null;
    };

    Toolbar.prototype.onRender = function() {
      var _this = this;
      this.navbar = this.$('ul.transit-nav-bar');
      this.panels.el = this.$('div.panels:eq(0)');
      return this.panels.getEl = (function() {
        return _this.$('div.panels:eq(0)');
      });
    };

    Toolbar.prototype.reset = function() {
      this.panels.reset();
      return this;
    };

    return Toolbar;

  })(Backbone.Marionette.Layout);

  Tab = function(panel) {
    var link, option, options, value;
    options = _.defaults({
      title: panel.title,
      href: '#'
    }, _.pick(panel.options, 'class', 'icon', 'id', 'href', 'rel', 'target'));
    link = $("<a></a>");
    for (option in options) {
      value = options[option];
      switch (option) {
        case 'class':
          link.addClass(value);
          break;
        case 'title':
          link.text(value);
          break;
        case 'icon':
          if (value !== "") {
            link.prepend($("<i></i>").addClass("icon-" + value));
          }
          break;
        default:
          link.attr(option, value);
      }
    }
    link.data('transit.panel_id', panel.cid).wrap("<li></li>");
    return link.parent('li').attr('rel', panel.cid);
  };

  this.Transit.Toolbar = Transit.Toolbar;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Toolbar;
  }

}).call(this);
(function() {
  var XHRUploadSupport, fileApiSupport,
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

  this.Transit.Uploader = (function(_super) {

    __extends(Uploader, _super);

    function Uploader() {
      return Uploader.__super__.constructor.apply(this, arguments);
    }

    Uploader.prototype.tagName = 'div';

    Uploader.prototype.className = 'transit-uploader';

    Uploader["native"] = XHRUploadSupport();

    return Uploader;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Transit.Asset = (function(_super) {

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

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Transit.Assets = (function(_super) {

    __extends(Assets, _super);

    function Assets() {
      return Assets.__super__.constructor.apply(this, arguments);
    }

    Assets.prototype.model = function() {
      return Transit.Asset;
    };

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

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Transit.Context = (function(_super) {

    __extends(Context, _super);

    function Context() {
      this._cleanup = __bind(this._cleanup, this);
      return Context.__super__.constructor.apply(this, arguments);
    }

    Context.build_as = 'contexts_attributes';

    Context.prototype.view = null;

    Context.prototype.type = null;

    Context.prototype.deliverable = null;

    Context.prototype.defaults = {
      _type: null,
      position: null
    };

    Context.prototype._pendingDestroy = false;

    Context.prototype.initialize = function() {
      var options;
      Context.__super__.initialize.apply(this, arguments);
      if (this.type === null) {
        if (this.get('_type') === null) {
          this.set('_type', this.constructor.name);
        }
        this.type = this.get('_type');
      }
      if (this.view === null) {
        options = {
          model: this
        };
        if (this.isNew()) {
          options.el = ".managed-context[data-context-id='\#\{@id\}']";
        }
        this.view = this.constructor.view === void 0 ? new Transit.View(options) : new this.constructor.view(options);
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

    return Context;

  })(Backbone.Model);

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
(function() {
  var $, Deliverable,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = window.$ || Backbone.$;

  Deliverable = (function(_super) {

    __extends(Deliverable, _super);

    function Deliverable() {
      this._view_options = __bind(this._view_options, this);

      this._build_contexts = __bind(this._build_contexts, this);

      this.invalidate = __bind(this.invalidate, this);
      return Deliverable.__super__.constructor.apply(this, arguments);
    }

    Deliverable.prototype.contexts = null;

    Deliverable.prototype.type = null;

    Deliverable.prototype.view = null;

    Deliverable.prototype.initialize = function() {
      if (this.type === null) {
        this.type = this.constructor.name;
      }
      this.view || (this.view = new Transit.Region(this._view_options));
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

    Deliverable.prototype._view_options = function() {
      var options;
      options = {
        model: this
      };
      if (this.isNew()) {
        options.el = "[data-region-id='\#\{@id\}']";
      }
      return options;
    };

    return Deliverable;

  })(Backbone.Model);

  Transit.Deliverable = Deliverable;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Deliverable;
  }

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Transit.AssetManager = (function(_super) {

    __extends(AssetManager, _super);

    function AssetManager() {
      this.render = __bind(this.render, this);

      this.add = __bind(this.add, this);
      return AssetManager.__super__.constructor.apply(this, arguments);
    }

    AssetManager.prototype.uploader = null;

    AssetManager.prototype.collection = null;

    AssetManager.prototype.images = null;

    AssetManager.prototype.files = null;

    AssetManager.prototype.title = 'Assets';

    AssetManager.prototype.attach = function(model) {
      this.model = model;
      if (this.model.assets === void 0) {
        return this.model.assets = new Transit.Assets();
      }
    };

    AssetManager.prototype.add = function(asset) {
      if (asset.isImage()) {
        return this.images.add(asset);
      } else {
        return this.files.add(asset);
      }
    };

    AssetManager.prototype.render = function() {
      AssetManager.__super__.render.apply(this, arguments);
      this.$el.addClass('transit-asset-manager');
      if (this.uploader === null) {
        this.uploader = new Transit.Uploader();
        this.$el.prepend(this.uploader.render().$el);
      }
      if (this.files === null) {
        this.files = new Transit.AssetManager.List({
          "class": 'files'
        });
      }
      if (this.images === null) {
        this.images = new Transit.AssetManager.List({
          "class": 'images'
        });
      }
      this.$el.append(this.images.render().$el);
      this.$el.append(this.files.render().$el);
      return this;
    };

    return AssetManager;

  })(Transit.Panel);

  this.Transit.AssetManager.List = (function(_super) {

    __extends(List, _super);

    function List() {
      this.add = __bind(this.add, this);
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.tagName = 'ul';

    List.prototype.initialize = function() {
      List.__super__.initialize.apply(this, arguments);
      if (this.options['class']) {
        return this.$el.addClass(this.options['class']);
      }
    };

    List.prototype.add = function(asset) {
      var item;
      item = new Transit.AssetManager.Item({
        model: asset
      });
      return this.$el.append(item.render.$el());
    };

    return List;

  })(Backbone.View);

  this.Transit.AssetManager.Item = (function(_super) {

    __extends(Item, _super);

    function Item() {
      this.remove = __bind(this.remove, this);

      this.render = __bind(this.render, this);
      return Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.events = {
      'click a[data-action="remove"]': 'remove'
    };

    Item.prototype.tagName = 'li';

    Item.prototype.type = null;

    Item.prototype.template = null;

    Item.prototype.initialize = function() {
      var _this = this;
      this.type = this.model.isImage() ? 'image' : 'file';
      this.$el.addClass(this.type);
      return Transit.tpl("/core/assets/" + this.type + ".jst", function(templ) {
        _this.template = templ;
        return _this.render();
      });
    };

    Item.prototype.render = function() {
      return this.$el.html(this.template({
        asset: this.model
      }));
    };

    Item.prototype.remove = function() {
      if (confirm("Are you sure you want to delete this " + this.type + "?")) {
        this.model.destroy();
        Transit.trigger('asset:removed', this.model);
        return Item.__super__.remove.apply(this, arguments);
      } else {
        return false;
      }
    };

    return Item;

  })(Backbone.View);

}).call(this);
(function() {
  var Transit,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  Transit.View = (function(_super) {

    __extends(View, _super);

    function View() {
      this.render = __bind(this.render, this);
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.tagName = 'div';

    View.prototype.className = 'context';

    View.prototype.render = function() {
      this.$el.attr('data-context-id', this.model.id).attr('data-context-type', this.model.type);
      return this;
    };

    return View;

  })(Backbone.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.View;
  }

}).call(this);
(function() {



}).call(this);
