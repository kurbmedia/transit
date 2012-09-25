(function() {
  var Backbone, Interface, Transit, klass, layout, renderer, _, _base, _i, _len, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Backbone = this.Backbone || require('backbone');

  _ = this._ || require('underscore');

  Transit = null;

  layout = null;

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

    Transit.prototype.VERSION = "0.3.0";

    Transit.prototype.one = Backbone.Events.one;

    return Transit;

  })(Backbone.Marionette.Application);

  Transit = new Transit();

  Transit.manage = function(model) {
    var manager;
    manager = new Transit.Manager({
      model: model
    });
    layout["interface"].show(manager);
    this.vent.trigger('manage', model, manager);
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
      "interface": '#transit_manager'
    };

    return Interface;

  })(Backbone.Marionette.Layout);

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



}).call(this);
(function() {
  var Backbone, Transit,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Backbone = this.Backbone || require('backbone');

  Transit = this.Transit || require('transit');

  Transit.View = (function(_super) {

    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.tagName = 'div';

    return View;

  })(Backbone.Marionette.ItemView);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.View;
  }

}).call(this);
(function() {
  var Backbone, Transit, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Transit = this.Transit || require('transit');

  Backbone = this.Backbone || require('backbone');

  _ = this._ || require('underscore');

  Transit.Manager = (function(_super) {

    __extends(Manager, _super);

    function Manager() {
      this.onClose = __bind(this.onClose, this);

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
      var model, panels, _ref;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      model = this.model;
      panels = _.map(panels, function(panel) {
        panel.model || (panel.model = model);
        return panel;
      });
      return (_ref = this.toolBar).add.apply(_ref, panels);
    };

    Manager.prototype.onRender = function() {
      this.toolBar = new Transit.Toolbar();
      return this.$el.append(this.toolBar.el);
    };

    Manager.prototype.onClose = function() {
      return this.toolBar.close();
    };

    Manager.prototype.drop = function() {
      var panels, _ref;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.toolBar).drop.apply(_ref, panels);
    };

    Manager.prototype.save = function() {
      this.trigger("before:save");
      this.model.save();
      this.trigger("after:save");
      return this;
    };

    Manager.prototype.reset = function() {
      return this.toolBar.reset();
    };

    return Manager;

  })(Backbone.Marionette.ItemView);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Manager;
  }

}).call(this);
(function() {
  var Backbone, Transit, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  Backbone = this.Backbone || require('backbone');

  _ = this._ || require('underscore');

  Transit.Modal = (function(_super) {

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

  Transit.modal = function(options) {
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

  if (typeof exports !== "undefined" && exports !== null) {
    exports.modal = Transit.modal;
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Modal;
  }

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

    Panel.prototype.template = function() {
      return '';
    };

    function Panel() {
      var prop, _i, _len, _ref;
      Panel.__super__.constructor.apply(this, arguments);
      _ref = ['title', 'icon', 'template'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        if (this.options[prop] !== void 0) {
          this[prop] = this.options[prop];
        }
      }
      if (this.$el.attr('id') === void 0) {
        this.$el.attr("id", "transit_panel_" + this.cid);
      }
      this.$el.attr('rel', this.cid);
    }

    return Panel;

  })(Transit.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Panel;
  }

}).call(this);
(function() {
  var Tab, TabbedRegion, Transit,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  Transit = this.Transit || require('transit');

  /*
  
  The Toolbar is the view that contains all of the editing / management
  panels within the UI. Panels can be added/removed as necessary to extend the 
  functionality of the manager.
  */


  TabbedRegion = (function(_super) {

    __extends(TabbedRegion, _super);

    function TabbedRegion() {
      return TabbedRegion.__super__.constructor.apply(this, arguments);
    }

    TabbedRegion.prototype.views = {};

    TabbedRegion.prototype.show = function(view) {
      this.ensureEl();
      if (this.currentView) {
        this.currentView.$el.hide();
      }
      view.render();
      if ($(".transit-panel[rel='" + view.cid + "']", this.$el).length === 0) {
        this.$el.append(view.$el);
      }
      view.$el.show();
      if (view.onShow) {
        view.onShow();
      }
      view.trigger("show");
      this.trigger("view:show", view);
      return this;
    };

    TabbedRegion.prototype.attachView = function(view) {
      var mine;
      TabbedRegion.__super__.attachView.apply(this, arguments);
      if (!this.views[view.cid]) {
        this.views[view.cid] = view;
        mine = this;
        return view.on('close', function() {
          view.off();
          return delete mine.views[this.cid];
        });
      }
    };

    return TabbedRegion;

  })(Backbone.Marionette.Region);

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

    Toolbar.prototype.regionType = TabbedRegion;

    Toolbar.prototype.regions = {
      panels: 'div.panels:eq(0)'
    };

    Toolbar.prototype.initialize = function() {
      return this.render();
    };

    Toolbar.prototype.add = function() {
      var mine, panel, panels, self, tab, _i, _len;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      self = this;
      for (_i = 0, _len = panels.length; _i < _len; _i++) {
        panel = panels[_i];
        if (this.navbar.find("li[rel='" + panel.cid + "']").length === 0) {
          tab = new Tab({
            panel: panel.cid,
            title: panel.title,
            icon: panel.icon
          });
          this.navbar.append(tab.render(panel).el);
          this.panels.attachView(panel);
          mine = this;
          tab.on('active', function() {
            mine.navbar.find("li").removeClass('active');
            this.$el.addClass('active');
            return mine.panels.show(this.panel);
          });
          tab.panel = panel;
          panel.tab = tab;
        }
      }
      if ($('> li.active', this.navbar).length === 0) {
        return $('a:eq(0)', this.navbar).click();
      }
    };

    Toolbar.prototype.drop = function() {
      var panel, panels, _i, _len;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = panels.length; _i < _len; _i++) {
        panel = panels[_i];
        panel.close();
        panel.tab.close();
        delete panel.tab;
        panel = null;
      }
      return this;
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

  Tab = (function(_super) {

    __extends(Tab, _super);

    function Tab() {
      return Tab.__super__.constructor.apply(this, arguments);
    }

    Tab.prototype.template = function() {
      return '';
    };

    Tab.prototype.tagName = 'li';

    Tab.prototype.events = {
      'click > a': 'choose'
    };

    Tab.prototype.panel = null;

    Tab.prototype.initialize = function() {
      return this.render();
    };

    Tab.prototype.choose = function(event) {
      event.preventDefault();
      return this.trigger('active', this);
    };

    Tab.prototype.beforeClose = function() {
      this.$('i,a').off().remove();
      return this.panel = null;
    };

    Tab.prototype.onRender = function() {
      var link, option, options, value;
      options = _.pick(this.options, 'class', 'icon', 'id', 'href', 'rel', 'target', 'title');
      this.$el.empty();
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
      this.$el.append(link);
      this.$el.attr('rel', this.options.panel);
      return this;
    };

    return Tab;

  })(Backbone.Marionette.ItemView);

  this.Transit.Toolbar = Transit.Toolbar;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Toolbar;
  }

}).call(this);
(function() {
  var Backbone, Transit, XHRUploadSupport, fileApiSupport,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  Backbone = this.Backbone || require('backbone');

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

  Transit.Uploader = (function(_super) {

    __extends(Uploader, _super);

    function Uploader() {
      return Uploader.__super__.constructor.apply(this, arguments);
    }

    Uploader.prototype.tagName = 'div';

    Uploader.prototype.className = 'transit-uploader';

    Uploader["native"] = XHRUploadSupport();

    return Uploader;

  })(Backbone.Marionette.ItemView);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Uploader;
  }

}).call(this);
(function() {
  var Backbone, Transit,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  Backbone = this.Backbone || require('backbone');

  Transit.Asset = (function(_super) {

    __extends(Asset, _super);

    function Asset() {
      return Asset.__super__.constructor.apply(this, arguments);
    }

    Asset.prototype.defaults = {
      urls: [],
      url: null,
      filename: null
    };

    return Asset;

  })(Backbone.Model);

  Transit.Asset.Image = (function(_super) {

    __extends(Image, _super);

    function Image() {
      return Image.__super__.constructor.apply(this, arguments);
    }

    Image.prototype.image = true;

    Image.prototype.defaults = {
      _type: 'image'
    };

    return Image;

  })(Transit.Asset);

  Transit.Asset.File = (function(_super) {

    __extends(File, _super);

    function File() {
      return File.__super__.constructor.apply(this, arguments);
    }

    File.prototype.image = false;

    File.prototype.defaults = {
      _type: 'file'
    };

    return File;

  })(Transit.Asset);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Asset;
  }

}).call(this);
(function() {
  var Backbone, Transit,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  Backbone = this.Backbone || require('backbone');

  Transit.Assets = (function(_super) {

    __extends(Assets, _super);

    function Assets() {
      return Assets.__super__.constructor.apply(this, arguments);
    }

    Assets.prototype.model = function(data) {
      var klass;
      klass = data['_type'] === 'image' ? Transit.Asset.Image : Transit.Asset.File;
      delete data['_type'];
      return new klass(data);
    };

    Assets.prototype.url = function() {
      return Transit.settings.asset_path;
    };

    return Assets;

  })(Backbone.Collection);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Assets;
  }

}).call(this);
(function() {
  var Backbone, Transit, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Backbone = this.Backbone || require('backbone');

  _ = this._ || require('underscore');

  Transit = this.Transit || require('transit');

  Transit.Context = (function(_super) {

    __extends(Context, _super);

    function Context() {
      this._cleanup = __bind(this._cleanup, this);
      return Context.__super__.constructor.apply(this, arguments);
    }

    Context.build_as = 'contexts_attributes';

    Context.prototype.type = null;

    Context.prototype.deliverable = null;

    Context.prototype.defaults = {
      _type: null,
      position: null
    };

    Context.prototype.view = null;

    Context.prototype._pendingDestroy = false;

    Context.prototype.initialize = function() {
      var loaded, options;
      Context.__super__.initialize.apply(this, arguments);
      if (this.type === null) {
        if (this.get('_type') === null) {
          this.set('_type', this.constructor.name);
        }
        this.type = this.get('_type');
      }
      loaded = Transit.Contexts.load(this.type);
      if (this.view === null) {
        options = {
          model: this
        };
        if (this.isNew()) {
          options.el = ".managed-context[data-context-id='\#\{@id\}']";
        }
        this.view = new loaded.view(options);
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

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Context;
  }

}).call(this);
(function() {
  var Backbone, Transit, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Backbone = this.Backbone || require('backbone');

  _ = this._ || require('underscore');

  Transit = this.Transit || require('transit');

  Transit.Contexts = (function(_super) {

    __extends(Contexts, _super);

    function Contexts() {
      return Contexts.__super__.constructor.apply(this, arguments);
    }

    Contexts.build_as = 'contexts_attributes';

    Contexts.subclasses = {};

    Contexts.load = function(name) {
      return Contexts.subclasses[name] || {
        model: Transit.Context,
        view: Transit.ContextView
      };
    };

    Contexts.setup = function(name, store) {
      var current, model;
      if (store == null) {
        store = {};
      }
      model = store.model || Transit.Context;
      store = _.defaults(store, {
        model: model,
        view: model.prototype.view || Transit.ContextView
      });
      current = Contexts.subclasses[name] || {};
      Contexts.subclasses[name] = _.extend(current, store);
      return Contexts;
    };

    Contexts.prototype._deliverable = null;

    Contexts.prototype.comparator = function(model) {
      return parseInt(model.get('position'));
    };

    Contexts.prototype.model = function(data) {
      var klass;
      klass = Transit.Contexts.load(data['_type']);
      return new klass.model(data);
    };

    return Contexts;

  }).call(this, Backbone.Collection);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Contexts;
  }

}).call(this);
(function() {
  var Backbone, Transit, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  Backbone = this.Backbone || require('backbone');

  _ = this._ || require('underscore');

  Transit.Deliverable = (function(_super) {

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
      this.contexts || (this.contexts = new Transit.Contexts());
      this.view || (this.view = new Transit.Region(this._view_options()));
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
      this.unset('contexts', {
        silent: true
      });
      return this;
    };

    Deliverable.prototype._view_options = function() {
      var options;
      options = {
        model: this
      };
      if (!this.isNew()) {
        options.el = "[data-deliverable-id='" + this.id + "']";
      }
      return options;
    };

    return Deliverable;

  })(Backbone.Model);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Deliverable;
  }

}).call(this);
(function() {
  var Transit,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  Transit.AssetManager = (function(_super) {

    __extends(AssetManager, _super);

    function AssetManager() {
      return AssetManager.__super__.constructor.apply(this, arguments);
    }

    AssetManager.prototype.title = 'Assets';

    AssetManager.prototype.className = 'transit-panel transit-asset-manager';

    AssetManager.prototype.initialize = function() {
      return this.render();
    };

    return AssetManager;

  })(Transit.Panel);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.AssetManager;
  }

}).call(this);
(function() {
  var Backbone, Transit,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Backbone = this.Backbone || require('backbone');

  Transit = this.Transit || require('transit');

  Transit.ContextView = (function(_super) {

    __extends(ContextView, _super);

    function ContextView() {
      return ContextView.__super__.constructor.apply(this, arguments);
    }

    ContextView.prototype.tagName = 'div';

    ContextView.prototype.className = 'context';

    ContextView.prototype.template = function() {
      return 'item!';
    };

    ContextView.prototype.onRender = function() {
      this.$el.attr('data-context-id', this.model.id).attr('data-context-type', this.model.type);
      return this;
    };

    return ContextView;

  })(Transit.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.ContextView;
  }

}).call(this);
(function() {
  var Transit,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  Transit.Region = (function(_super) {

    __extends(Region, _super);

    function Region() {
      this.onRender = __bind(this.onRender, this);
      return Region.__super__.constructor.apply(this, arguments);
    }

    Region.prototype.tagName = 'div';

    Region.prototype.className = 'region';

    Region.prototype.initialize = function() {
      return this.collection = this.model.contexts;
    };

    Region.prototype.buildItemView = function(model) {
      return this.getItemView(model);
    };

    Region.prototype.getItemView = function(model) {
      return model.view;
    };

    Region.prototype.onRender = function() {
      return this.$el.attr('data-deliverable-id', this.model.id).attr('data-deliverable-type', this.model.type);
    };

    return Region;

  })(Backbone.Marionette.CollectionView);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Region;
  }

}).call(this);
(function() {
  var Backbone, Transit, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transit = this.Transit || require('transit');

  Backbone = this.Backbone || require('backbone');

  _ = this._ || require('underscore');

  Transit.Form = (function(_super) {

    __extends(Form, _super);

    function Form() {
      return Form.__super__.constructor.apply(this, arguments);
    }

    Form.prototype.className = 'transit-form transit-panel';

    Form.prototype.events = {
      'change input[data-binding]': 'update',
      'blur input[data-binding]': 'update'
    };

    Form.prototype.initialize = function() {
      return this.bindTo(this, 'item:rendered', this.setup);
    };

    Form.prototype.setup = function() {
      var _this = this;
      this.bindTo(this.model, 'change', this.render);
      return this.$('input, textarea').each(function(i, node) {
        var view;
        view = new Transit.Form.Field({
          el: $(node),
          model: _this.model
        });
        return _this.on('close', (function() {
          return view.close();
        }));
      });
    };

    Form.prototype.update = function(event) {
      var field, opts, value;
      if (event && event.currentTarget) {
        field = $(event.currentTarget);
        value = field.val();
        opts = event.type === 'blur' ? {
          silent: true
        } : {};
        this.model.set(field.data('binding'), value, opts);
        return this;
      }
    };

    return Form;

  })(Transit.Panel);

  Transit.Form.Field = (function(_super) {

    __extends(Field, _super);

    function Field() {
      return Field.__super__.constructor.apply(this, arguments);
    }

    Field.prototype.events = {
      'change': 'validate'
    };

    Field.prototype.binding = null;

    Field.prototype.initialize = function() {
      var attr;
      attr = this.$el.data('binding');
      if (attr !== void 0) {
        this.binding = attr;
        this.bindTo(this.model, "change:" + this.binding, this.update);
      }
      return this.update();
    };

    Field.prototype.validate = function(event) {
      if (this.$el.is(':checkbox') || this.$el.is(":radio")) {
        return this;
      }
    };

    Field.prototype.update = function() {
      if (this.$el.is(":checkbox")) {
        if (this.model.get(this.binding)) {
          return this.$el.attr('checked', 'checked');
        }
      } else if (this.$el.is(":radio") && this.model.get(this.binding) === this.$el.attr('value')) {
        return this.$el.click();
      } else {
        return this.$el.val(this.model.get(this.binding));
      }
    };

    return Field;

  })(Backbone.Marionette.ItemView);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Form;
  }

}).call(this);
