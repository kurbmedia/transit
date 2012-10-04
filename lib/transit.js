(function() {
  var Backbone, Transit, klass, _, _base, _i, _len, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

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

    function Transit() {
      this.manage = __bind(this.manage, this);

      this.init = __bind(this.init, this);

      this.initializer = __bind(this.initializer, this);

    }

    Transit.prototype.VERSION = "0.3.0";

    Transit.prototype.manager = null;

    Transit.prototype._initializers = [];

    Transit.prototype._cache = {
      context: {}
    };

    Transit.prototype.compile = function(data) {
      return _.template(data);
    };

    Transit.prototype.get = function(type, name) {
      return this._cache[type.toLowerCase()][name];
    };

    Transit.prototype.initializer = function(cb) {
      this._initializers.push(cb);
      return this;
    };

    Transit.prototype.init = function() {
      var dfds,
        _this = this;
      this.trigger('before:initialize');
      dfds = _.collect(this._initializers.reverse(), function(callback) {
        var dfd;
        dfd = $.Deferred();
        callback(dfd.resolve);
        return dfd;
      });
      return $.when.apply(null, dfds).then(function() {
        _this.trigger('after:initialize');
        return _this.trigger('ready');
      });
    };

    Transit.prototype.manage = function(model, callback) {
      if (this.manager !== null) {
        this.manager.close();
        this.manager.model = model;
      } else {
        this.manager = new this.Manager({
          model: model
        });
      }
      this.manager.render(callback);
      return this.manager;
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

  _.extend(Transit.prototype, Backbone.Events);

  Transit = this.Transit = new Transit();

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

  Transit.selection = new Selector();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Selection;
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

    View.prototype.keep = false;

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
      if (this.keep !== true) {
        this.remove();
      }
      if (this.manager !== null) {
        this.manager.release(this);
      }
      this.closed = true;
      this._unbindNodes();
      this.trigger('close');
      _ref1 = [this.model, this.collection, Transit];
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
      this.trigger('closed');
      this.off(null, null, this);
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

    View.prototype.prepend = function() {
      var view, views, _i, _len;
      views = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.add(views);
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        view.$el.detach().prependTo(this.$el);
      }
      if (views.length === 1) {
        return views[0];
      } else {
        return views;
      }
    };

    View.prototype.release = function() {
      var view, views, _i, _len;
      views = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        this.subviews[view.cid] = null;
        delete this.subviews[view.cid];
        if ($.contains(this.$el.get(0), $(view.el).get(0)) && view.keep === false) {
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
        _this.trigger('render');
        Transit.runCallbacks.call(_this, 'beforeRender');
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
        _this.trigger('rendered');
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
      var attr, evt, model, node, selector, _ref, _results;
      if (!this.model) {
        return this;
      }
      _ref = this.bindings;
      _results = [];
      for (selector in _ref) {
        attr = _ref[selector];
        node = this.$(selector);
        evt = node.is('input, textarea, select') ? "change.transit" : "blur.transit";
        model = this.model;
        _results.push(this.$el.on(evt, selector, function() {
          var props;
          props = {};
          props[attr] = node.val();
          return model.set(props, {
            silent: true
          });
        }));
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
  var Backbone, Transit, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Transit = this.Transit || require('transit');

  Backbone = this.Backbone || require('backbone');

  _ = this._ || require('underscore');

  Transit.Manager = (function(_super) {

    __extends(Manager, _super);

    function Manager() {
      return Manager.__super__.constructor.apply(this, arguments);
    }

    Manager.prototype.tagName = 'div';

    Manager.prototype.className = 'transit-manager';

    Manager.prototype.events = {
      'click button.save': 'save'
    };

    Manager.prototype.initialize = function() {
      this.toolbar || (this.toolbar = new Transit.Toolbar());
      return this.toolbar.manager = this;
    };

    Manager.prototype.helpers = function() {
      return {
        heading: "Manage " + this.model.type
      };
    };

    Manager.prototype.beforeClose = function() {
      return this.toolbar.close();
    };

    Manager.prototype.afterClose = function() {
      return $('#transit_manager').remove();
    };

    Manager.prototype.afterRender = function() {
      if ($('#transit_manager').length === 0) {
        $('body').append(this.$el);
        this.$el.attr('id', 'transit_manager');
      }
      this.toolbar.render();
      return this.$el.append(this.toolbar.$el);
    };

    Manager.prototype.addTabs = function() {
      var panels, _ref;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.toolbar).add.apply(_ref, panels);
    };

    Manager.prototype.removeTabs = function() {
      var panels, _ref;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.toolbar).release.apply(_ref, panels);
    };

    Manager.prototype.reset = function(callback) {
      return this.toolbar.reset(callback);
    };

    Manager.prototype.save = function() {
      this.trigger("before:save");
      this.model.save();
      this.trigger("after:save");
      return this;
    };

    return Manager;

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

    Modal.prototype.wrapper = false;

    Modal.prototype.afterRender = function() {
      Transit.manager.add(this);
      this.$el.attr('id', "transit_modal_" + this.cid).addClass('out');
      this.handler.call(this, true);
      return this.$el.removeClass('out').addClass('in');
    };

    Modal.prototype.beforeClose = function() {
      return Transit.manager.release(this);
    };

    Modal.prototype.handler = function(open) {
      var _this = this;
      if (open === true) {
        this.$el.modal({
          show: true,
          backdrop: true
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
      return $(this.template({
        message: message,
        type: type
      })).addClass('transit-alert fade in').appendTo($('#transit_manager'));
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

    Panel.prototype.activate = function() {
      return this.trigger('activate');
    };

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
      'change [data-binding]': 'update',
      'blur [data-binding]': 'update'
    };

    Form.prototype.afterRender = function() {
      var prop, value, _ref, _results,
        _this = this;
      _ref = this.model.attributes;
      _results = [];
      for (prop in _ref) {
        value = _ref[prop];
        _results.push(this.$("[data-binding='" + prop + "']").each(function(i, node) {
          node = $(node);
          if (node.is(":input")) {
            return node.val(value);
          } else {
            return node.html(value);
          }
        }));
      }
      return _results;
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

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Form;
  }

}).call(this);
(function() {
  var Tab, Transit,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Transit = this.Transit || require('transit');

  Transit.Toolbar = (function(_super) {

    __extends(Toolbar, _super);

    function Toolbar() {
      this.add = __bind(this.add, this);
      return Toolbar.__super__.constructor.apply(this, arguments);
    }

    Toolbar.prototype.template = function() {
      return '';
    };

    Toolbar.prototype.wrapper = false;

    Toolbar.prototype.panels = {};

    Toolbar.prototype.manager = null;

    Toolbar.prototype.list = null;

    Toolbar.prototype.beforeClose = function() {
      var cid, panel, _ref, _results;
      _ref = this.panels;
      _results = [];
      for (cid in _ref) {
        panel = _ref[cid];
        panel.close();
        _results.push(delete this.panels[cid]);
      }
      return _results;
    };

    Toolbar.prototype.afterRender = function() {
      if (this.$el.attr('id') === void 0) {
        this.$el.attr("id", "transit_toolbar");
      }
      return this.list = this.$('ul.transit-nav-bar');
    };

    Toolbar.prototype.add = function() {
      var activator, model, panel, panels, tab, that, _i, _len;
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
        that = this;
        activator = function(wants) {
          var cid, view, _ref, _results;
          that.list.find('li').removeClass("active");
          _ref = that.panels;
          _results = [];
          for (cid in _ref) {
            view = _ref[cid];
            if (cid === wants) {
              if (view.$el.hasClass('active')) {
                view.trigger('inactive');
                _results.push(typeof view.inactive === "function" ? view.inactive() : void 0);
              } else {
                view.$el.addClass('active');
                _results.push(typeof view.active === "function" ? view.active() : void 0);
              }
            } else {
              if (view.$el.hasClass('active')) {
                view.trigger('inactive');
                if (typeof view.inactive === "function") {
                  view.inactive();
                }
              }
              _results.push(view.$el.removeClass('active'));
            }
          }
          return _results;
        };
        tab.on('activate', (function() {
          return activator(this.panel);
        }));
        panel.on('activate', (function() {
          return activator(this.cid);
        }));
        panel.on('inactive', function() {
          this.$el.removeClass('active');
          return this._tab.$el.removeClass('active');
        });
        this.list.append(tab.$el);
        tab.render();
        this.panels[panel.cid] = panel;
        Transit.manager.add(panel).render();
      }
      if (panels.length === 1) {
        return panels[0];
      } else {
        return panels;
      }
    };

    Toolbar.prototype.prepend = function() {
      var panel, panels, _i, _len;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.add.apply(this, panels);
      for (_i = 0, _len = panels.length; _i < _len; _i++) {
        panel = panels[_i];
        panel._tab.$el.detach().prependTo(this.list.$el);
      }
      if (panels.length === 1) {
        return panels[0];
      } else {
        return panels;
      }
    };

    Toolbar.prototype.release = function() {
      var panel, panels, _i, _len;
      panels = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = panels.length; _i < _len; _i++) {
        panel = panels[_i];
        if (panel._tab) {
          panel._tab.close();
        }
        panel.close();
        delete this.panels[panel.cid];
      }
      if (panels.length === 1) {
        return panels[0];
      } else {
        return panels;
      }
    };

    Toolbar.prototype.reset = function(callback) {
      var cid, panel, _ref;
      _ref = this.panels;
      for (cid in _ref) {
        panel = _ref[cid];
        panel.close();
        delete this.panels[cid];
      }
      this.close();
      if (typeof callback === "function") {
        callback();
      }
      return this;
    };

    return Toolbar;

  })(Transit.View);

  Tab = (function(_super) {

    __extends(Tab, _super);

    function Tab() {
      return Tab.__super__.constructor.apply(this, arguments);
    }

    Tab.prototype.tagName = 'li';

    Tab.prototype.template = "{{> transit_toolbar_tab}}";

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

    Context.prototype.type = 'Context';

    Context.prototype.deliverable = null;

    Context.prototype.defaults = {
      _type: null,
      position: null
    };

    Context.prototype.view = null;

    Context.prototype._destroyed = false;

    function Context() {
      this._view_options = __bind(this._view_options, this);

      var view;
      Transit.runCallbacks.call(this, 'before:initialize');
      Context.__super__.constructor.apply(this, arguments);
      this._setType();
      view = this.view;
      if (view === null) {
        view = Transit.ContextView;
      }
      this.view = new view(this._view_options());
      this._bindView();
    }

    Context.prototype.destroy = function() {
      if (this.isNew()) {
        Context.__super__.destroy.apply(this, arguments);
      } else {
        this._destroyed = true;
      }
      return this;
    };

    Context.prototype.toJSON = function() {
      var base;
      base = Context.__super__.toJSON.apply(this, arguments);
      if (this._destroyed) {
        base['_destroy'] = true;
      }
      return base;
    };

    Context.prototype._setType = function() {
      var current;
      if (!(this.type === null || this.type === void 0)) {
        return this;
      }
      current = this.get('_type');
      if (current === null || current === void 0) {
        throw new Error("Contexts must declare a 'type' attribute.");
      }
      return this.type = current;
    };

    Context.prototype._bindView = function() {
      return this.on('change', function(options) {
        if (this.view) {
          return this.view.trigger('update');
        }
      });
    };

    Context.prototype._view_options = function() {
      var options;
      options = {
        model: this
      };
      if (!this.isNew()) {
        options.el = "[data-context-id='" + this.id + "']";
      }
      return options;
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

    Contexts.prototype.comparator = function(model) {
      return parseInt(model.get('position'));
    };

    Contexts.prototype.model = function(data) {
      var klass;
      klass = Transit.get('context', data['_type']);
      if (klass === null || klass === void 0) {
        klass = Transit.Context;
      }
      return new klass(data);
    };

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
      var _this = this;
      if (this.type === null) {
        this.type = this.constructor.name;
      }
      this.contexts || (this.contexts = new Transit.Contexts());
      this.view || (this.view = new Transit.Region(this._view_options()));
      this.on('change:contexts', this._build_contexts);
      this.contexts.on('add', function(model) {
        return _this.view.add(model.view).render();
      });
      this.contexts.on('remove', function(model) {
        var _ref, _ref1;
        if ((_ref = model.view) != null) {
          _ref.keep = false;
        }
        if (model.view) {
          _this.view.release(model.view);
        }
        return (_ref1 = model.view) != null ? _ref1.close() : void 0;
      });
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
      var data, result, sends;
      data = {};
      this.contexts.each(function(con, index) {
        return data[index.toString()] = con.toJSON();
      });
      result = {};
      result["" + Transit.Contexts.build_as] = data;
      sends = {};
      sends[(this.type || this.get('_type')).toLowerCase()] = _.extend(Deliverable.__super__.toJSON.apply(this, arguments), result);
      return sends;
    };

    Deliverable.prototype._build_contexts = function() {
      var contexts, _ref;
      contexts = this.attributes.contexts || [];
      this.contexts.reset(contexts);
      this.unset('contexts', {
        silent: true
      });
      if ((_ref = this.view) != null) {
        _ref.update();
      }
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

    ContextView.prototype.className = 'context managed-context';

    ContextView.prototype.keep = true;

    ContextView.prototype.template = function() {
      return '';
    };

    ContextView.prototype.beforeRender = function() {
      if (!this.model.isNew()) {
        return this.wrapper = false;
      }
    };

    ContextView.prototype.afterRender = function() {
      if (!this.$el.attr('data-context-id')) {
        this.$el.attr('data-context-id', this.model.id);
      }
      if (!this.$el.attr('data-context-type')) {
        this.$el.attr('data-context-type', this.model.type);
      }
      this.wrapper = true;
      return this;
    };

    ContextView.prototype.beforeClose = function() {
      if (this.model.isNew()) {
        return this.keep = false;
      }
    };

    ContextView.prototype.afterClose = function() {
      return this.keep = true;
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

    Region.prototype.keep = true;

    Region.prototype.initialize = function() {};

    Region.prototype.beforeRender = function() {
      if (!this.model.isNew()) {
        return this.wrapper = false;
      }
    };

    Region.prototype.afterRender = function() {
      this.$el.attr('data-deliverable-id', this.model.id).attr('data-deliverable-type', this.model.type);
      this.wrapper = true;
      return this.update();
    };

    Region.prototype.update = function() {
      var _this = this;
      return this.model.contexts.each(function(con) {
        _this.release(con.view);
        _this.add(con.view);
        if (con.isNew()) {
          return con.view.render();
        }
      });
    };

    return Region;

  })(Transit.View);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Transit.Region;
  }

}).call(this);
