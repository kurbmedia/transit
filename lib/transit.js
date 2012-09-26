(function() {
  var Backbone, Interface, Transit, klass, _, _base, _i, _len, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Backbone = this.Backbone || require('backbone');

  _ = this._ || require('underscore');

  Transit = null;

  /*---------------------------------------
    Backbone Extensions
  ---------------------------------------
  */


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

  /*---------------------------------------
    Class
  ---------------------------------------
  */


  Transit = (function() {

    Transit.prototype.VERSION = "0.3.0";

    Transit.prototype.ui = null;

    Transit.prototype._initializers = [];

    Transit.prototype._cache = {
      context: {}
    };

    function Transit() {
      this.manage = __bind(this.manage, this);

      this.init = __bind(this.init, this);

      this.initializer = __bind(this.initializer, this);
      this.ui = new Interface();
    }

    Transit.prototype.compile = function(data) {
      return _.template(data);
    };

    Transit.prototype.get = function(type, name) {
      return this._cache[type.toLowerCase()][name];
    };

    Transit.prototype.initializer = function(cb) {
      var callback;
      callback = $.Deferred(function(dfd) {
        return cb(dfd.resolve);
      }).promise();
      this._initializers.push(callback);
      return this;
    };

    Transit.prototype.init = function() {
      var _this = this;
      this.trigger('before:initialize');
      return $.when.apply(null, this._initializers).then(function() {
        _this.trigger('after:initialize');
        return _this.trigger('ready');
      });
    };

    Transit.prototype.manage = function(model, callback) {
      var manager;
      manager = new this.Manager({
        model: model
      });
      this.ui.setView(manager).render(callback);
      return manager;
    };

    Transit.prototype.render = function(template, data) {
      if (_.isString(template)) {
        return this.compile(template)(data);
      }
      if (_.isFunction(template)) {
        return template(data);
      }
      if (_.isObject(template)) {
        return template.template(_.extend(data, template.data), template.options)(data);
      }
      throw new Error("The template " + template + " could not be rendered.");
    };

    Transit.prototype.runCallbacks = function() {
      var type, types, _j, _len1, _ref1, _results;
      types = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref1 = _.unique(types);
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        type = _ref1[_j];
        if (this[type]) {
          _results.push(this[type]());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Transit.prototype.set = function(type, name, prop) {
      this._cache[type.toLowerCase()][name] = prop;
      return this;
    };

    Transit.prototype.end = function() {
      this.ui.close();
      this.off(null, null, this);
      return this;
    };

    return Transit;

  })();

  Interface = (function(_super) {

    __extends(Interface, _super);

    function Interface() {
      this.append = __bind(this.append, this);
      return Interface.__super__.constructor.apply(this, arguments);
    }

    Interface.prototype.tagName = 'div';

    Interface.prototype.className = 'transit-ui';

    Interface.prototype.id = 'transit_ui';

    Interface.prototype.subview = null;

    Interface.prototype.rendered = false;

    Interface.prototype.append = function(element) {
      return this.$el.append(element);
    };

    Interface.prototype.close = function() {
      if (this.subview !== null) {
        this.subview.close();
      }
      this.off(null, null, this);
      return this.remove();
    };

    Interface.prototype.render = function() {
      if (this.rendered === true) {
        return this;
      }
      this.rendered = true;
      this.$el.append('<div id="transit_manager"></div>').appendTo($('body'));
      return this;
    };

    Interface.prototype.setView = function(view) {
      var _base1,
        _this = this;
      if (this.subview !== null) {
        if (typeof (_base1 = this.subview).close === "function") {
          _base1.close();
        }
      }
      this.subview = view;
      this.subview.render().then(function(el) {
        return _this.$('#transit_manager').html(_this.subview.el);
      });
      return this.subview;
    };

    return Interface;

  })(Backbone.View);

  _.extend(Transit.prototype, Backbone.Events);

  Transit = this.Transit = new Transit();

  /*---------------------------------------
    Initializers
  ---------------------------------------
  */


  Transit.initializer(function(done) {
    Transit.ui.render();
    return done();
  });

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

  Transit.browser = Browser;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Browser;
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
  var Transit, _;

  Transit = this.Transit || require('transit');

  _ = this._ || require('underscore');

  Transit.Validator = (function() {

    function Validator() {}

    Validator.prototype.messages = {
      required: 'Required',
      regexp: 'Invalid',
      email: 'Invalid email address',
      url: 'Invalid URL',
      match: 'Must match field "{{field}}"'
    };

    return Validator;

  })();

  Transit.validate = function(input) {};

  if (typeof exports !== "undefined" && exports !== null) {
    exports.validate = Transit.validate;
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Validator;
  }

}).call(this);
(function() {
  var TemplateCache, Transit, _,
    __slice = [].slice;

  Transit = this.Transit || require('transit');

  _ = this._ || require("underscore");

  TemplateCache = (function() {

    function TemplateCache() {}

    TemplateCache.prototype.cache = {};

    TemplateCache.prototype.get = function(path) {
      var _this = this;
      return $.Deferred(function(dfd) {
        var template;
        path || (path = "");
        if (_this.cache[path]) {
          return dfd.resolve(_this.cache[path]);
        }
        if (_.isFunction(template)) {
          _this.cache[path] = template;
          return dfd.resolve(template);
        }
        template = $("[data-template-name='" + path + "']");
        if (template.length === 0) {
          if (/\//.test(template)) {
            return $.get(path, function(data) {
              _this.cache[path] = Transit.compile(data);
              return dfd.resolve(_this.cache[path]);
            });
          } else {
            _this.cache[path] = Transit.compile(path);
          }
        } else {
          _this.cache[path] = Transit.compile(template.html());
        }
        return dfd.resolve(_this.cache[path]);
      }).promise();
    };

    TemplateCache.prototype.set = function(path, template) {};

    TemplateCache.prototype.clear = function() {
      var path, paths, _i, _len, _results;
      paths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        _results.push(delete this.cache[path]);
      }
      return _results;
    };

    return TemplateCache;

  })();

  Transit.TemplateCache = new TemplateCache();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.TemplateCache;
  }

}).call(this);
(function() {
  var Backbone, Transit, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Backbone = this.Backbone || require('backbone');

  Transit = this.Transit || require('transit');

  _ = this._ || require('underscore');

  Transit.View = (function(_super) {

    __extends(View, _super);

    View.prototype.tagName = 'div';

    View.prototype.bindings = {};

    View.prototype.container = null;

    View.prototype.containerMethod = 'html';

    View.prototype.closed = false;

    View.prototype.helpers = {};

    View.prototype.manager = null;

    View.prototype.subviews = {};

    View.prototype.template = null;

    View.prototype.wrapper = true;

    function View() {
      this.release = __bind(this.release, this);

      this.detach = __bind(this.detach, this);

      var klass, name, selector, updates, val, view, _i, _len, _ref, _ref1;
      Transit.runCallbacks.call(this, 'beforeInitialize');
      View.__super__.constructor.apply(this, arguments);
      updates = {};
      _ref = this.subviews;
      for (klass = _i = 0, _len = _ref.length; _i < _len; klass = ++_i) {
        selector = _ref[klass];
        view = new klass();
        view.container = this.$el;
        updates[view.cid] = view;
      }
      _ref1 = this.options;
      for (name in _ref1) {
        val = _ref1[name];
        if (_.has(this, name) && val) {
          this[name] = val;
        }
      }
      if (_.has(this.options, 'template')) {
        this.template = this.options.template;
      }
      this.subviews = updates;
    }

    View.prototype.add = function() {
      var view, views, _i, _len;
      views = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.release(views);
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        this.$el.append(view.$el);
        this.subviews[view.cid] = view;
        view.manager = this;
      }
      if (views.length === 1) {
        return views[0];
      } else {
        return views;
      }
    };

    View.prototype.close = function(callback) {
      var cid, target, view, _i, _len, _ref, _ref1;
      if (this.closed) {
        if (typeof callback === "function") {
          callback();
        }
        return this;
      }
      _ref = this.subviews;
      for (cid in _ref) {
        view = _ref[cid];
        view.close();
      }
      Transit.runCallbacks.call(this, 'beforeClose', 'beforeRemove');
      this.$el.off('.transit');
      this.remove();
      if (this.manager !== null) {
        this.manager.release(this);
      }
      this.closed = true;
      this._unbindNodes();
      this.trigger('close');
      _ref1 = [this, this.model, this.collection, Transit];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        target = _ref1[_i];
        if (target) {
          target.off(null, null, this);
        }
      }
      this.getViews().each(function(view) {
        return view.close();
      });
      this.model = null;
      this.collection = null;
      Transit.runCallbacks.call(this, 'afterRemove', 'afterClose');
      if (typeof callback === "function") {
        callback();
      }
      return this;
    };

    View.prototype.compile = function() {
      var content, dfd,
        _this = this;
      dfd = $.Deferred();
      if (this.template === null) {
        content = "";
        this.wrapper = true;
        dfd.resolveWith(this, [content]);
      } else if (_.isFunction(this.template)) {
        dfd.resolveWith(this, [this.template]);
      } else {
        Transit.TemplateCache.get(this.template).then(function(data) {
          return dfd.resolveWith(_this, [data]);
        });
      }
      return dfd.promise();
    };

    View.prototype.detach = function() {
      this.$el.detach();
      return this;
    };

    View.prototype.getViews = function(callback) {
      var views;
      views = _.chain(_.values(this.subviews)).map(function(view) {
        return [].concat(view);
      }, this).flatten();
      if (typeof callback === "function") {
        callback(views.values());
      }
      return views;
    };

    View.prototype.release = function() {
      var view, views, _i, _len;
      views = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        this.subviews[view.cid] = null;
        delete this.subviews[view.cid];
        if ($.contains(this.el, view.el)) {
          view.detach();
        }
      }
      if (views.length === 1) {
        return views[0];
      } else {
        return views;
      }
    };

    View.prototype.render = function(callback) {
      var dfd,
        _this = this;
      this.closed = false;
      dfd = $.Deferred();
      this.compile().then(function(tpl) {
        var content;
        content = Transit.render(tpl, _this.serialize());
        if (_this.beforeRender) {
          _this.beforeRender(tpl, content);
        }
        if (_this.wrapper === true) {
          _this.$el.html(content);
        } else {
          if (content !== void 0) {
            _this.setElement($(content));
          }
        }
        if (_this.container !== null) {
          $.fn[_this.containerMethod].call($(_this.container), _this.$el);
        }
        Transit.runCallbacks.call(_this, 'afterRender');
        _this._bindNodes();
        if (typeof callback === "function") {
          callback();
        }
        return dfd.resolveWith(_this, [_this.el]);
      });
      return dfd.promise();
    };

    View.prototype.serialize = function() {
      var data, helpers;
      data = {};
      if (this.model) {
        data = _.extend(data, this.model.toJSON());
      }
      if (this.collection) {
        data = _.extend(data, {
          items: this.collection.toJSON()
        });
      }
      helpers = _.isFunction(this.helpers) ? this.helpers.call(this) : this.helpers;
      return _.extend(helpers, data);
    };

    View.prototype._bindNodes = function() {
      var attr, evt, node, selector, _base, _ref, _results,
        _this = this;
      if (!this.model) {
        return this;
      }
      _ref = this.bindings;
      _results = [];
      for (selector in _ref) {
        attr = _ref[selector];
        node = this.$(selector);
        evt = typeof (_base = node.is('input, textarea, select')) === "function" ? _base({
          "change.transit": "blur.transit"
        }) : void 0;
        _results.push(this.$el.on(evt, selector, (function() {
          return _this.model.set("" + attr, node.val());
        })));
      }
      return _results;
    };

    View.prototype._unbindNodes = function() {
      var selector, _i, _len, _ref, _results;
      _ref = _.keys(this.bindings);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selector = _ref[_i];
        _results.push(this.$(selector).off('.transit'));
      }
      return _results;
    };

    return View;

  })(Backbone.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.View;
  }

}).call(this);
(function() {
  var Backbone, Tab, Transit, _,
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
      this.add = __bind(this.add, this);
      return Manager.__super__.constructor.apply(this, arguments);
    }

    Manager.prototype.tagName = 'div';

    Manager.prototype.className = 'transit-manager';

    Manager.prototype.events = {
      'click button.save': 'save'
    };

    Manager.prototype.initialize = function() {
      this.panels || (this.panels = new Transit.Manager.Panels());
      return this.navbar || (this.navbar = new Transit.Manager.Navbar());
    };

    Manager.prototype.helpers = function() {
      return {
        heading: "Manage " + this.model.type
      };
    };

    Manager.prototype.add = function() {
      var model, panel, panels, tab, that, _i, _len;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      model = this.model;
      for (_i = 0, _len = panels.length; _i < _len; _i++) {
        panel = panels[_i];
        if (_.isUndefined(panel.model)) {
          panel.model = model;
        }
        tab = new Tab({
          title: panel.title,
          icon: panel.icon
        });
        tab.panel = panel.cid;
        panel._tab = tab;
        that = this.panels;
        tab.on('activate', function() {
          var wants;
          wants = this.panel;
          return that.getViews().each(function(view) {
            if (view.cid === wants) {
              view.$el.addClass('active');
              if (view.active) {
                return view.active();
              }
            } else {
              view.$el.removeClass('active');
              return view._tab.$el.removeClass('active');
            }
          });
        });
        this.navbar.add(tab).render();
        this.panels.add(panel).render();
      }
      if (this.navbar.$('li.active').length === 0) {
        this.navbar.$('a:eq(0)').click();
      }
      if (panels.length === 1) {
        return panels[0];
      } else {
        return panels;
      }
    };

    Manager.prototype.beforeClose = function() {
      this.panels.close();
      return this.navbar.close();
    };

    Manager.prototype.afterRender = function() {
      this.panels.setElement(this.$('div.panels:eq(0)')).render();
      return this.navbar.setElement(this.$('ul.transit-nav-bar')).render();
    };

    Manager.prototype.save = function() {
      this.trigger("before:save");
      this.model.save();
      this.trigger("after:save");
      return this;
    };

    Manager.prototype.release = function() {
      var panel, panels, _i, _len;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = panels.length; _i < _len; _i++) {
        panel = panels[_i];
        if (panel._tab) {
          panel._tab.close();
        }
        panel.close();
      }
      if (panels.length === 1) {
        return panels[0];
      } else {
        return panels;
      }
    };

    Manager.prototype.reset = function(callback) {
      this.panels.close();
      this.navbar.close();
      if (typeof callback === "function") {
        callback();
      }
      return this;
    };

    return Manager;

  })(Transit.View);

  Tab = (function(_super) {

    __extends(Tab, _super);

    function Tab() {
      return Tab.__super__.constructor.apply(this, arguments);
    }

    Tab.prototype.tagName = 'li';

    Tab.prototype.template = "{{> transit_navbar_tab}}";

    Tab.prototype.panel = null;

    Tab.prototype.events = {
      'click a': 'activate'
    };

    Tab.prototype.activate = function(event) {
      if (event) {
        event.preventDefault();
      }
      this.$el.addClass('active');
      return this.trigger('activate');
    };

    Tab.prototype.beforeClose = function() {
      return this.panel = null;
    };

    Tab.prototype.serialize = function() {
      var base, option, options, value;
      base = Tab.__super__.serialize.apply(this, arguments);
      base = _.defaults(Tab.__super__.serialize.apply(this, arguments), {
        title: 'Tab'
      });
      base.css = _.compact(_.flatten([base.css]));
      options = _.pick(this.options, 'class', 'icon', 'title');
      for (option in options) {
        value = options[option];
        switch (option) {
          case 'class':
            base.css.push(value);
            break;
          case 'title':
            base.title = value;
            break;
          case 'icon':
            if (value !== "") {
              base.icon = $("<i></i>").addClass("icon-" + value) + "";
            }
        }
      }
      return base;
    };

    Tab.prototype.afterRender = function() {
      return this.$el.attr('rel', this.panel);
    };

    return Tab;

  })(Transit.View);

  Transit.Manager.Panels = (function(_super) {

    __extends(Panels, _super);

    function Panels() {
      return Panels.__super__.constructor.apply(this, arguments);
    }

    Panels.prototype.tagName = 'div';

    Panels.prototype.className = 'panels';

    Panels.prototype.wrapper = false;

    return Panels;

  })(Transit.View);

  Transit.Manager.Navbar = (function(_super) {

    __extends(Navbar, _super);

    function Navbar() {
      return Navbar.__super__.constructor.apply(this, arguments);
    }

    Navbar.prototype.template = function() {};

    Navbar.prototype.wrapper = false;

    return Navbar;

  })(Transit.View);

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
      this.perform = __bind(this.perform, this);
      return Modal.__super__.constructor.apply(this, arguments);
    }

    Modal.prototype.className = 'transit-modal';

    Modal.prototype.events = {
      'click a[data-action],button[data-action]': 'perform'
    };

    Modal.prototype.container = '#transit_ui';

    Modal.prototype.containerMethod = 'append';

    Modal.prototype.wrapper = false;

    Modal.prototype.afterRender = function() {
      this.$el.attr('id', "transit_modal_" + this.cid).addClass('out');
      this.handler.call(this, true);
      return this.$el.removeClass('out').addClass('in');
    };

    Modal.prototype.handler = function(open) {
      var _this = this;
      if (open === true) {
        this.$el.modal({
          show: true
        }).one('hidden', function(event) {
          Transit.trigger('modal:close', _this);
          return _this.close();
        });
      } else {
        this.$el.modal('hide');
      }
      return this;
    };

    Modal.prototype.initialize = function() {
      Modal.__super__.initialize.apply(this, arguments);
      return this.options = _.defaults(this.options, {
        buttons: [],
        title: "Title Missing",
        content: "Content missing"
      });
    };

    Modal.prototype.perform = function(event) {
      var acts, link;
      event.preventDefault();
      link = $(event.currentTarget);
      acts = link.attr('data-action');
      Transit.trigger('modal:action', acts, this);
      this.trigger('modal:action', acts, this);
      if (acts === 'close') {
        this.handler.call(this, false);
      }
      return this;
    };

    Modal.prototype.serialize = function() {
      return _.extend(Modal.__super__.serialize.apply(this, arguments), this.options);
    };

    return Modal;

  })(Transit.View);

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
  var Transit,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Transit = this.Transit || require('transit');

  Transit.Notify = (function() {

    function Notify() {
      this.render = __bind(this.render, this);

      this.success = __bind(this.success, this);

      this.info = __bind(this.info, this);

      this.error = __bind(this.error, this);

    }

    Notify.prototype.error = function(message) {
      return this.render(message, 'error');
    };

    Notify.prototype.info = function(message) {
      return this.render(message, 'info');
    };

    Notify.prototype.success = function(message) {
      return this.render(message, 'success');
    };

    Notify.prototype.render = function(message, type) {
      return Transit.ui.append($(this.template({
        message: message,
        type: type
      })));
    };

    return Notify;

  })();

  Transit.notify = function(type, message) {
    var notice;
    notice = new Transit.Notify();
    notice[type](message);
    return this;
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.notify = Transit.notify;
  }

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

    Panel.prototype.className = 'transit-panel';

    Panel.prototype.title = 'Detail';

    Panel.prototype.icon = '';

    Panel.prototype._tab = null;

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

  })(Transit.View);

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
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Backbone = this.Backbone || require('backbone');

  _ = this._ || require('underscore');

  Transit = this.Transit || require('transit');

  Transit.Context = (function(_super) {

    __extends(Context, _super);

    Context.prototype.type = null;

    Context.prototype.deliverable = null;

    Context.prototype.defaults = {
      _type: null,
      position: null
    };

    Context.prototype.view = null;

    function Context() {
      var options, view;
      Transit.runCallbacks.call(this, 'before:initialize');
      Context.__super__.constructor.apply(this, arguments);
      this._setType();
      view = this.view;
      options = {
        model: this
      };
      if (!this.isNew()) {
        options.el = ".managed-context[data-context-id='" + this.id + "']";
      }
      if (view === null) {
        view = Transit.ContextView;
      }
      this.view = new view(options);
      this._bindView();
      this.on('destroy', this._destroy);
    }

    Context.prototype._destroy = function() {
      this.off(null, null, this);
      this.view.off(null, null, this);
      return delete this.view;
    };

    Context.prototype._setType = function() {
      if (this.type === null) {
        if (this.get('_type') === null) {
          this.set('_type', this.constructor.name);
        }
        return this.type = this.get('_type');
      }
    };

    Context.prototype._bindView = function() {
      return this.on('change', function(options) {
        if (this.view) {
          return this.view.trigger('update');
        }
      });
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

    Contexts.prototype.model = Transit.Context;

    return Contexts;

  })(Backbone.Collection);

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
      this.afterRender = __bind(this.afterRender, this);
      return Region.__super__.constructor.apply(this, arguments);
    }

    Region.prototype.tagName = 'div';

    Region.prototype.className = 'region';

    Region.prototype.initialize = function() {};

    Region.prototype.afterRender = function() {
      return this.$el.attr('data-deliverable-id', this.model.id).attr('data-deliverable-type', this.model.type);
    };

    return Region;

  })(Transit.View);

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

  })(Transit.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Form;
  }

}).call(this);
