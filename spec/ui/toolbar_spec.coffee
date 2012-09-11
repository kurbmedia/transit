describe 'Transit.Toolbar', ()->
  
  item = new Transit.Deliverable()
  heading = null
  
  beforeEach ()-> 
    Transit.init(item)
    heading = Transit.Toolbar.$('h1')
  
  it 'creates a view for Transit.Toolbar', ()->
    expect(Transit.Toolbar instanceof Backbone.View)
      .toBeTruthy()
  
  it 'creates a heading node', ()->
    expect(Transit.Toolbar.$('h1').length)
      .toNotEqual(0)

  it 'creates a tab-bar list', ()->
    expect(Transit.Toolbar.$('ul.transit-nav-bar').length)
      .toNotEqual(0)
   
  it 'creates a tab bar instance', ()->
    expect(Transit.Toolbar.tabBar)
       .toBeDefined()
  
  describe 'Panels', ()->
    choose    = ()-> Transit.Toolbar.$el.find(selector)
    panel     = new Transit.Panel()
    panel2    = new Transit.Panel()
    selector  = ""

    beforeEach ()-> selector = "#transit_panel_#{panel.cid}"
    
    describe 'adding panels with Toolbar.add', ()->
        
      it 'adds a panel to the toolbar node', ()->
        Transit.one "panel:added", ()=>
          expect(Transit.Toolbar.$el)
            .toContain(selector)
        Transit.Toolbar.add(panel)
          
      it 'adds a tab to the toolbar\'s tabBar', ()->
        Transit.one "panel:added", ()=>
          expect(Transit.Toolbar.tabBar
            .find(panel.cid))
            .toBeDefined()
        Transit.Toolbar.add(panel)
        
    describe 'removing panels with Toolbar.remove', ()->
        
      afterEach ()->
        Transit.Toolbar.reset()
      
      describe 'when there is only one panel', ()->
        
        beforeEach ()->
          Transit.Toolbar.add(panel)
          
        it 'removes the panel by object', ()->
          Transit.one 'panel:removed', ()=>
            expect(Transit.Toolbar.$el.find(selector))
              .toHaveSize(0)
          Transit.Toolbar.remove(panel)
          
        it 'removes the panel by cid', ()->
          Transit.one 'panel:removed', ()=>
            expect(Transit.Toolbar.$el.find(selector))
              .toHaveSize(0)
          Transit.Toolbar.remove(panel.cid)
      
        it 'removes the associated tab', ()->
          Transit.one 'panel:removed', ()=>
            expect(Transit.Toolbar.tabBar
              .el.find("li"))
              .toHaveSize(0)
          Transit.Toolbar.remove(panel)
  
      describe 'when there are multiple panels', ()->
        
        beforeEach ()->
          Transit.Toolbar.add(panel, panel2)
          
        it 'removes only the requested panel', ()->
          Transit.one 'panel:removed', ()=>
            expect(Transit.Toolbar.$el.find('div.transit-panel'))
              .toHaveSize(1)
          Transit.Toolbar.remove(panel)
      
        it 'removes only the associated tab', ()->
          Transit.one 'panel:removed', ()=>
            expect(Transit.Toolbar.tabBar
              .el.find("li"))
              .toHaveSize(1)
          Transit.Toolbar.remove(panel)

    describe 'removing all panels with Toolbar.reset', ()->
      
      beforeEach ()->
        Transit.Toolbar.add(panel, panel)
      
      it 'removes all panels', ()->
        Transit.one 'panel:removed', ()=>
          expect(Transit.Toolbar.$el.find('div.transit-panel'))
            .toHaveSize(0)
        Transit.Toolbar.reset()
          
      it 'removes all tabs', ()->
        Transit.one 'panel:removed', ()=>
          expect(Transit.Toolbar.tabBar.el.find('li'))
            .toHaveSize(0)
        Transit.Toolbar.reset()
    
  describe '.set', ()->
    
    describe 'with "heading"', ()->
      
      beforeEach ()-> 
        Transit.Toolbar.set('heading', 'Test')
    
      it 'sets the toolbar heading', ()->
        expect(heading.text())
          .toEqual("Test")