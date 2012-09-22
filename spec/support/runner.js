(function() {

  describe("Transit", function() {
    it('creates a global object', function() {
      return expect(Transit).to.exist;
    });
    describe('on .manage with model', function() {
      var item, manage;
      item = new Transit.Deliverable();
      manage = Transit.manage(item);
      it('returns an instance of the manager', function() {
        return expect(manage).to.be.an["instanceof"](Transit.Manager);
      });
      return it('renders the interface', function() {
        return expect($('#transit_ui').length).to.be.above(0);
      });
    });
    return describe('the .one event handler', function() {
      var callback;
      callback = null;
      beforeEach(function() {
        callback = sinon.spy();
        Transit.one('spec:init', callback);
        Transit.trigger('spec:init');
        return Transit.trigger('spec:init');
      });
      return it('only runs the callback once', function() {
        return expect(callback.callCount).to.equal(1);
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
      var item;
      item = new Transit.Context();
      it('assigns a .type value from the name', function() {
        return expect(item.type).to.equal('Context');
      });
      it('assigns the _type attribute from the name', function() {
        return expect(item.type).to.equal('Context');
      });
      it('assigns a view object', function() {
        return expect(item.view).to.exist;
      });
      describe('when it has a view element', function() {
        beforeEach(function() {
          Transit.Context.view = ContextView;
          return item = new Transit.Context();
        });
        afterEach(function() {
          return Transit.Context.view = Transit.View;
        });
        return it('creates a view from that element', function() {
          return expect(item.view).to.be.an["instanceof"](ContextView);
        });
      });
      return describe('when it does not have a view element', function() {
        return it('creates a view from Transit.View', function() {
          return expect(item.view).to.be.an["instanceof"](Transit.View);
        });
      });
    });
    return describe('a subclass', function() {
      var Audio, audio;
      Audio = (function(_super) {

        __extends(Audio, _super);

        function Audio() {
          return Audio.__super__.constructor.apply(this, arguments);
        }

        return Audio;

      })(Transit.Context);
      audio = new Audio();
      it('assigns a .type value from the name', function() {
        return expect(audio.type).to.equal('Audio');
      });
      it('assigns the _type attribute from the name', function() {
        return expect(audio.get('_type')).to.equal('Audio');
      });
      it('inherits defaults', function() {
        return expect(_.has(audio.defaults, 'position')).to.equal(true);
      });
      describe('when no view is defined', function() {
        return it('assigns a context view object', function() {
          return expect(audio.view).to.be.an["instanceof"](Backbone.View);
        });
      });
      return describe('when a view is defined', function() {
        beforeEach(function() {
          return Transit.set('view', 'Audio', function() {});
        });
        return it('assigns a view object', function() {
          return expect(audio.view).to.exist;
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
      it('.contexts is a Contexts collection', function() {
        return expect(item.contexts instanceof Transit.Contexts).toBeTruthy();
      });
      it('creates a region view', function() {
        return expect(item.view).toBeDefined();
      });
      return it('.view is a Transit.Region', function() {
        return expect(item.view).toBeInstanceOf(Transit.Region);
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
(function() {

  describe('Region', function() {});

}).call(this);
