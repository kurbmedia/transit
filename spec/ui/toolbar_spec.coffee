describe 'toolBar', ()->
  
  item = new Transit.Deliverable()
  heading = null
  manager = null
  toolBar = null
  
  beforeEach ()-> 
    manager = Transit.manage(item)
    manager.render()
    toolBar = manager.toolBar
    heading = toolBar.$('h1')
  
  it 'creates a view for toolBar', ()->
    expect(toolBar instanceof Backbone.View)
      .toBeTruthy()
  
  it 'creates a heading node', ()->
    expect(toolBar.$('h1').length)
      .toNotEqual(0)

  it 'creates a tab-bar list', ()->
    expect(toolBar.$('ul.transit-nav-bar').length)
      .toNotEqual(0)
   
  it 'creates a tab bar instance', ()->
    expect(toolBar.tabBar)
       .toBeDefined()
  
  describe 'Panels', ()->
    choose    = ()-> toolBar.$el.find(selector)
    panel     = new Transit.Panel()
    panel2    = new Transit.Panel()
    selector  = ""

    beforeEach ()-> selector = "#transit_panel_#{panel.cid}"
    
    describe 'adding panels with Toolbar.add', ()->
        
      it 'adds a panel to the toolbar node', ()->
        Transit.one "panel:added", ()=>
          expect(toolBar.$el)
            .toContain(selector)
        toolBar.add(panel)
          
      it 'adds a tab to the toolbar\'s tabBar', ()->
        Transit.one "panel:added", ()=>
          expect(toolBar.tabBar
            .find(panel.cid))
            .toBeDefined()
        toolBar.add(panel)
        
    describe 'removing panels with Toolbar.remove', ()->
        
      afterEach ()->
        toolBar.reset()
      
      describe 'when there is only one panel', ()->
        
        beforeEach ()-> toolBar.reset()
          
        it 'removes the panel by object', ()->
          runs ()-> toolBar.add(panel)
          waits(200)
          runs ()-> toolBar.remove(panel)
          waits(200)
          expect(toolBar.$el.find(selector))
            .toHaveSize(0)
          
        it 'removes the panel by cid', ()->
          runs ()-> toolBar.add(panel)
          waits(200)
          runs ()-> toolBar.remove(panel.cid)
          waits(200)
          runs ()->
            expect(toolBar.$el.find(selector))
              .toHaveSize(0)
      
        it 'removes the associated tab', ()->
          waits(200)
          runs ()-> toolBar.remove(panel)
          expect(toolBar.tabBar
            .el.find("li"))
            .toHaveSize(0)
  
      describe 'when there are multiple panels', ()->
        
        beforeEach ()->
          toolBar.add(panel, panel2)
          waits(200)
          runs ()-> toolBar.remove(panel)
          
        it 'removes only the requested panel', ()->
          expect(toolBar.$el.find('div.transit-panel'))
            .toHaveSize(1)
          
      
        it 'removes only the associated tab', ()->
          expect(toolBar.tabBar
            .el.find("li"))
            .toHaveSize(1)

    describe 'removing all panels with Toolbar.reset', ()->
      
      spy = null
      
      beforeEach ()->
        spy = spyOn( toolBar.tabBar, 'remove')
        toolBar.add(panel, panel2)
        waits(100)
        runs ()-> toolBar.reset()
      
      it 'removes all panels', ()->
        expect(toolBar.$el.find('div.transit-panel'))
          .toHaveSize(0)
        

      it 'removes all tabs', ()->
        expect(spy)
          .toHaveBeenCalledWith(panel.cid)
        
  describe '.set', ()->
    
    describe 'with "heading"', ()->
      
      beforeEach ()-> 
        toolBar.set('heading', 'Test')
    
      it 'sets the toolbar heading', ()->
        expect(heading.text())
          .toEqual("Test")