(function() {

  describe("Transit", function() {
    it('creates a global object', function() {
      return expect(window.Transit).toBeDefined();
    });
    describe('on .manage with model', function() {
      beforeEach(function() {
        this.item = new Transit.Deliverable();
        return this.manage = Transit.manage(this.item);
      });
      it('returns an instance of the manager', function() {
        return expect(this.manage instanceof Transit.Manager).toBeTruthy();
      });
      return it('renders the interface', function() {
        return expect($('#transit_ui')).toHaveSize(1);
      });
    });
    return describe('the .one event handler', function() {
      beforeEach(function() {
        this.callback = sinon.spy();
        Transit.one('spec:init', this.callback);
        Transit.trigger('spec:init');
        return Transit.trigger('spec:init');
      });
      return it('only runs the callback once', function() {
        return expect(this.callback.callCount).toEqual(1);
      });
    });
  });

}).call(this);
(function() {

  describe('Cache', function() {
    var lookup;
    it('attaches itself to Transit', function() {
      return expect(Transit.cache).toBeDefined();
    });
    lookup = function(name) {
      return Transit.get('context', name);
    };
    it('stores items as an object, by type', function() {
      return expect(Transit.cache.context).toBeDefined();
    });
    describe('when an item is added', function() {
      beforeEach(function() {
        return Transit.set('context', 'Sample', 'test');
      });
      it('is stored by the specified type', function() {
        return expect(Transit.cache.context['sample']).toBeDefined();
      });
      return it('automatically lowercases the type', function() {
        return expect(Transit.cache.context['Sample']).toBeUndefined();
      });
    });
    return describe('when a item is requested', function() {
      return describe('and the item exists', function() {
        beforeEach(function() {
          return Transit.set('context', 'Sample', 'test');
        });
        it('returns the item', function() {
          return expect(lookup('sample')).toBe('test');
        });
        return describe('and the item does not exist', function() {
          return it('returns null', function() {
            return expect(lookup('missing')).toBeNull();
          });
        });
      });
    });
  });

}).call(this);
(function() {

  describe('Transit.browser', function() {});

}).call(this);
(function() {

  describe('Selection', function() {});

}).call(this);
(function() {

  describe('Templates', function() {
    var pathify;
    pathify = function(path) {
      return Transit.Template.pathify(path);
    };
    beforeEach(function() {
      return Transit.Template.url = '/transit/views';
    });
    it('has a class level cache', function() {
      var result;
      result = _.isObject(Transit.Template.cache);
      return expect(result).toBeTruthy();
    });
    describe('@pathify', function() {
      beforeEach(function() {
        return this.pathname = "/transit/views/core/test.jst";
      });
      describe('when a path includes view_path', function() {
        beforeEach(function() {
          return this.result = pathify("/transit/views/core/test.jst");
        });
        return it('returns the orignal path', function() {
          return expect(this.result).toEqual(this.pathname);
        });
      });
      return describe('when a path does not include view_path', function() {
        beforeEach(function() {
          return this.result = pathify("/core/test.jst");
        });
        return it('returns the path including view_path', function() {
          return expect(this.result).toEqual(this.pathname);
        });
      });
    });
    return describe('template caching', function() {
      describe('when a view is set with .set', function() {
        beforeEach(function() {
          Transit.Template.set('/spec/set.jst', "test");
          return this.template = Transit.Template.find('/spec/set.jst');
        });
        it('should cache the set template', function() {
          return expect(this.template).toBeDefined();
        });
        it('sets the template path from the path', function() {
          return expect(this.template.path).toEqual('/transit/views/spec/set.jst');
        });
        it('sets the source from the source', function() {
          return expect(this.template.source).toEqual("test");
        });
        return it('generates a compiled function', function() {
          return expect(this.template.func instanceof Function).toBeTruthy();
        });
      });
      return describe('compile', function() {
        beforeEach(function() {
          return this.template = Transit.Template.compile("test");
        });
        return it('generates a compiled template', function() {
          return expect(this.template instanceof Function).toBeTruthy();
        });
      });
    });
  });

}).call(this);
(function() {

  describe('Manager window', function() {
    beforeEach(function() {
      this.item = new Transit.Deliverable();
      this.manager = Transit.manage(this.item);
      return this.heading = this.manager.$('h1');
    });
    return it('is an instance of a Backbone.View', function() {
      return expect(this.manager instanceof Backbone.View).toBeTruthy();
    });
  });

}).call(this);
(function() {

  describe('Modal', function() {
    var modal;
    modal = null;
    return describe('any instance', function() {
      return describe('.perform', function() {
        var spy;
        spy = null;
        beforeEach(function() {
          spy = jasmine.createSpy('perform');
          Transit.one('modal:action', spy);
          modal = Transit.modal();
          return modal.perform(mockEvent({
            currentTarget: $('<a data-action="test"></a>')
          }));
        });
        it('triggers modal:action globally', function() {
          return expect(spy).toHaveBeenCalled();
        });
        return it('passes the action and the modal to the callback', function() {
          return expect(spy).toHaveBeenCalledWith('test', modal);
        });
      });
    });
  });

}).call(this);
(function() {

  describe('Notify', function() {
    it('has an error method', function() {
      return expect(Transit.Notify['error']).toBeDefined();
    });
    it('has an info method', function() {
      return expect(Transit.Notify['info']).toBeDefined();
    });
    return it('has a success method', function() {
      return expect(Transit.Notify['success']).toBeDefined();
    });
  });

}).call(this);
(function() {

  describe('Toolbar panels', function() {
    var item, link, manager, panel, panel2, panels, tab, tabs;
    panel = new Transit.Panel();
    panel2 = new Transit.Panel();
    item = new Transit.Deliverable();
    tabs = null;
    panels = null;
    tab = null;
    link = null;
    manager = null;
    beforeEach(function() {
      manager = Transit.manage(item);
      manager.render();
      panels = manager.toolBar.$('div.panels');
      return tabs = manager.toolBar.tabBar;
    });
    return describe('Panels', function() {
      describe('calling Manager.add', function() {
        tab = null;
        beforeEach(function() {
          manager.toolBar.add(panel);
          return tab = tabs.tabs[panel.cid];
        });
        it('adds a tab to the tab bar', function() {
          return expect(tabs.el).toContain('li');
        });
        it('adds a panel to the panels list', function() {
          return expect($('div.transit-panel', panels)).toHaveSize(1);
        });
        describe('the added tab', function() {
          return it('contains a link with the panel\'s title', function() {
            return expect(tab.find('a')).toHaveText("Detail");
          });
        });
        return afterEach(function() {
          return panel.remove();
        });
      });
      return describe('calling .remove on a panel', function() {
        beforeEach(function() {
          manager.toolBar.add(panel);
          panel.remove();
          return panels = manager.$('div.panels');
        });
        it('removes the panel', function() {
          return expect(panels.find('div.transit-panel')).toHaveSize(0);
        });
        return it('removes the associated tab', function() {
          return expect($('li', tabs.el)).toHaveSize(0);
        });
      });
    });
  });

}).call(this);
(function() {

  describe('toolBar', function() {
    var heading, item, manager, toolBar;
    item = new Transit.Deliverable();
    heading = null;
    manager = null;
    toolBar = null;
    beforeEach(function() {
      manager = Transit.manage(item);
      manager.render();
      toolBar = manager.toolBar;
      return heading = toolBar.$('h1');
    });
    it('creates a view for toolBar', function() {
      return expect(toolBar instanceof Backbone.View).toBeTruthy();
    });
    it('creates a heading node', function() {
      return expect(toolBar.$('h1').length).toNotEqual(0);
    });
    it('creates a tab-bar list', function() {
      return expect(toolBar.$('ul.transit-nav-bar').length).toNotEqual(0);
    });
    it('creates a tab bar instance', function() {
      return expect(toolBar.tabBar).toBeDefined();
    });
    describe('Panels', function() {
      var choose, panel, panel2, selector;
      choose = function() {
        return toolBar.$el.find(selector);
      };
      panel = new Transit.Panel();
      panel2 = new Transit.Panel();
      selector = "";
      beforeEach(function() {
        return selector = "#transit_panel_" + panel.cid;
      });
      describe('adding panels with Toolbar.add', function() {
        it('adds a panel to the toolbar node', function() {
          var _this = this;
          Transit.one("panel:added", function() {
            return expect(toolBar.$el).toContain(selector);
          });
          return toolBar.add(panel);
        });
        return it('adds a tab to the toolbar\'s tabBar', function() {
          var _this = this;
          Transit.one("panel:added", function() {
            return expect(toolBar.tabBar.find(panel.cid)).toBeDefined();
          });
          return toolBar.add(panel);
        });
      });
      describe('removing panels with Toolbar.remove', function() {
        afterEach(function() {
          return toolBar.reset();
        });
        describe('when there is only one panel', function() {
          beforeEach(function() {
            return toolBar.reset();
          });
          it('removes the panel by object', function() {
            runs(function() {
              return toolBar.add(panel);
            });
            waits(200);
            runs(function() {
              return toolBar.remove(panel);
            });
            waits(200);
            return expect(toolBar.$el.find(selector)).toHaveSize(0);
          });
          it('removes the panel by cid', function() {
            runs(function() {
              return toolBar.add(panel);
            });
            waits(200);
            runs(function() {
              return toolBar.remove(panel.cid);
            });
            waits(200);
            return runs(function() {
              return expect(toolBar.$el.find(selector)).toHaveSize(0);
            });
          });
          return it('removes the associated tab', function() {
            waits(200);
            runs(function() {
              return toolBar.remove(panel);
            });
            return expect(toolBar.tabBar.el.find("li")).toHaveSize(0);
          });
        });
        return describe('when there are multiple panels', function() {
          beforeEach(function() {
            toolBar.add(panel, panel2);
            waits(200);
            return runs(function() {
              return toolBar.remove(panel);
            });
          });
          it('removes only the requested panel', function() {
            return expect(toolBar.$el.find('div.transit-panel')).toHaveSize(1);
          });
          return it('removes only the associated tab', function() {
            return expect(toolBar.tabBar.el.find("li")).toHaveSize(1);
          });
        });
      });
      return describe('removing all panels with Toolbar.reset', function() {
        var spy;
        spy = null;
        beforeEach(function() {
          spy = spyOn(toolBar.tabBar, 'remove');
          toolBar.add(panel, panel2);
          waits(100);
          return runs(function() {
            return toolBar.reset();
          });
        });
        it('removes all panels', function() {
          return expect(toolBar.$el.find('div.transit-panel')).toHaveSize(0);
        });
        return it('removes all tabs', function() {
          return expect(spy).toHaveBeenCalledWith(panel.cid);
        });
      });
    });
    return describe('.set', function() {
      return describe('with "heading"', function() {
        beforeEach(function() {
          return toolBar.set('heading', 'Test');
        });
        return it('sets the toolbar heading', function() {
          return expect(heading.text()).toEqual("Test");
        });
      });
    });
  });

}).call(this);
(function() {

  describe('Uploader', function() {});

}).call(this);
(function() {

  describe('Asset', function() {});

}).call(this);
(function() {

  describe('Assets', function() {});

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe('Context', function() {
    var ContextView;
    ContextView = (function(_super) {

      __extends(ContextView, _super);

      function ContextView() {
        return ContextView.__super__.constructor.apply(this, arguments);
      }

      return ContextView;

    })(Transit.View);
    describe('any instance', function() {
      beforeEach(function() {
        return this.item = new Transit.Context();
      });
      it('assigns a .type value from the name', function() {
        return expect(this.item.type).toEqual('Context');
      });
      it('assigns the _type attribute from the name', function() {
        return expect(this.item.type).toEqual('Context');
      });
      it('assigns a view object', function() {
        return expect(this.item.view).toBeDefined();
      });
      describe('when it has a view element', function() {
        beforeEach(function() {
          Transit.Context.view = ContextView;
          return this.item = new Transit.Context();
        });
        return it('creates a view from that element', function() {
          return expect(this.item.view).toBeInstanceOf(ContextView);
        });
      });
      return describe('when it does not have a view element', function() {
        return it('creates a view from Transit.View', function() {
          return expect(this.item.view).toBeInstanceOf(Transit.View);
        });
      });
    });
    return describe('a subclass', function() {
      var Audio;
      Audio = (function(_super) {

        __extends(Audio, _super);

        function Audio() {
          return Audio.__super__.constructor.apply(this, arguments);
        }

        return Audio;

      })(Transit.Context);
      beforeEach(function() {
        return this.audio = new Audio();
      });
      it('assigns a .type value from the name', function() {
        return expect(this.audio.type).toEqual('Audio');
      });
      it('assigns the _type attribute from the name', function() {
        return expect(this.audio.get('_type')).toEqual('Audio');
      });
      it('inherits defaults', function() {
        return expect(_.has(this.audio.defaults, 'position')).toBeTruthy();
      });
      describe('when no view is defined', function() {
        return it('assigns a context view object', function() {
          return expect(this.audio.view).toBeInstanceOf(Backbone.View);
        });
      });
      return describe('when a view is defined', function() {
        beforeEach(function() {
          return Transit.set('view', 'Audio', function() {});
        });
        it('assigns a view object', function() {
          return expect(this.audio.view).toBeDefined();
        });
        return afterEach(function() {
          return delete Transit.cache.view['audio'];
        });
      });
    });
  });

}).call(this);
(function() {

  describe('Context collections', function() {});

}).call(this);
(function() {

  describe('Deliverable', function() {
    var item;
    item = new Transit.Deliverable();
    describe('any instance', function() {
      it('creates a contexts object', function() {
        return expect(item.contexts).toBeDefined();
      });
      return it('.contexts is a Contexts collection', function() {
        return expect(item.contexts instanceof Transit.Contexts).toBeTruthy();
      });
    });
    describe('building contexts from attributes', function() {
      beforeEach(function() {
        return item.set('contexts', [
          {
            name: 'first',
            _type: 'Context'
          }, {
            name: 'second',
            _type: 'Context'
          }
        ]);
      });
      it('converts the attributes to a collection', function() {
        return expect(item.contexts.length).toEqual(2);
      });
      it('removes the contexts attribute', function() {
        return expect(item.get('contexts')).toBeUndefined();
      });
      return afterEach(function() {
        return item.contexts = new Transit.Contexts();
      });
    });
    return describe('generating json', function() {
      var json;
      json = [];
      beforeEach(function() {
        item.set('contexts', [
          {
            name: 'first',
            _type: 'Context'
          }, {
            name: 'second',
            _type: 'Context'
          }
        ]);
        return json = item.toJSON()['page'];
      });
      it('creates a key from Transit.Contexts.build_as', function() {
        return expect(json['contexts_attributes']).toBeDefined();
      });
      return it('uses context data as the value(s)', function() {
        return expect(_.size(json['contexts_attributes'])).toEqual(2);
      });
    });
  });

}).call(this);
(function() {

  describe('Asset Manager', function() {});

}).call(this);
(function() {

  describe('the base view', function() {
    beforeEach(function() {
      this.model = new Transit.Context({
        id: 1
      });
      return this.view = new Transit.View({
        model: this.model
      });
    });
    it('should inherit Backbone.View', function() {
      return expect(this.view).toBeInstanceOf(Backbone.View);
    });
    return describe('its element', function() {
      beforeEach(function() {
        return this.result = this.view.render().$el;
      });
      it('should add data-context-type with the model\'s type', function() {
        expect(this.result.data('context-type')).toBeDefined();
        return expect(this.result.data('context-type')).toEqual('Context');
      });
      return it('should add data-context-id with the model\'s id', function() {
        expect(this.result.data('context-id')).toBeDefined();
        return expect(this.result.data('context-id')).toEqual(1);
      });
    });
  });

}).call(this);
