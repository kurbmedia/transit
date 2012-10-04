describe 'Manager window', ()->
  
  item = new Transit.Deliverable()
  manager = null 
  toolbar = null
  list    = null

  before (done)->
    manager = Transit.manage(item)
    done()

  beforeEach (done)->
    toolbar = manager.toolbar
    list    = toolbar.list
    done()
    
  
  it 'is an instance of Transit.View', ()->
    expect(manager).to.be.an.instanceof(
      Transit.View
    )
  
  it 'creates a nav-bar list', ()->
    expect(manager.$('ul.transit-nav-bar'))
      .to.have.length.above(0)
   
  it 'creates a toolbar instance', ()->
    expect(manager.toolbar)
       .to.exist
  
  it 'sets a heading using the deliverable name', ()->
    expect(manager.serialize())
      .to.have.property('heading')
    expect(manager.serialize().heading)
      .to.match(/Manage/)
  
  it 'adds the heading text to its h1', ()->
    expect(manager.$('h1.header').text())
      .to.match(/Manage/)
  
  describe "managing panels", ()->
    
    choose = null
    panel    = new Transit.Panel()
    panel2   = new Transit.Panel()
    selector = "#transit_panel_#{panel.cid}"
    
    beforeEach (done)->
      choose = -> $(selector)
      done()
    
    describe 'adding panels with addTab', ()->
      
      before ()-> manager.addTabs(panel)
      after (done)-> manager.reset(done)
      
      it 'adds a panel to the panels view', ()->
        expect($(selector))
          .to.have.length(1)
  
      it 'adds a tab to the navbar', ()->
        expect(toolbar.$("li[rel='#{panel.cid}']"))
          .to.have.length(1)
    
    describe 'adding panels with prepend', ()->
      
      before (done)-> 
        manager.addTabs(panel2)
        toolbar.prepend(panel)
        done()
        
      after (done)-> manager.reset(done)
      
      it 'prepends a tab to the navbar', ()->
        expect(toolbar.$("li:eq(0)").attr('rel'))
          .to.include(panel.cid)
        
    describe 'removing tabs with .removeTab', ()->
        
      afterEach ()-> manager.reset()
      
      describe 'when there is only one tab', ()->
        
        beforeEach (done)-> 
          manager.addTabs(panel)
          done()
          
        it 'removes the tab by object', (done)->
          manager.removeTabs(panel)
          done()
          expect(manager.$(selector))
            .to.have.length(0)
          
        it 'removes the associated tab', (done)->
          manager.removeTabs(panel)
          done()
          expect(toolbar.$("li[rel='#{panel.cid}']"))
            .to.have.length(0)
  
      describe 'when there are multiple panels', ()->
        
        beforeEach (done)->
          manager.addTabs(panel, panel2)
          done()
          
        it 'removes only the requested panel', (done)->
          manager.removeTabs(panel)
          done()
          expect(manager.$('div.transit-panel'))
            .to.have.length(2)
      
        it 'removes only the associated tab', (done)->
          manager.removeTabs(panel)
          done()
          expect(toolbar.$("li"))
            .to.have.length(1)
        
        afterEach (done)-> manager.reset(done)
  
    describe 'removing all panels with .reset', ()->
      
      beforeEach (done)->
        manager.addTabs(panel, panel2)
        done()
      
      it 'removes all panels', (done)->
        manager.reset()
        done()
        expect(manager.$('div.transit-panel'))
          .to.have.length(0)
  
      it 'removes all tabs', (done)->
        manager.reset()
        done()
        expect(toolbar.$("li"))
          .to.have.length(0)