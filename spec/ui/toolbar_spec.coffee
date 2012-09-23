describe "a manager's Toolbar", ()->
  
  item = new Transit.Deliverable()
  manager = null
  toolbar = null
  navbar  = null
  
  before (done)-> 
    manager = Transit.manage(item)
    done()
  
  beforeEach (done)->
    toolbar = manager.toolBar
    navbar  = toolbar.navbar
    done()
  
  it 'creates a view for toolBar', ()->
    expect(toolbar).to.be.an
      .instanceof(Backbone.Marionette.Layout)

  it 'creates a tab-bar list', ()->
    expect(toolbar.$('ul'))
      .to.have.length.above(0)
   
  it 'creates a tab bar instance', ()->
    expect(toolbar.navbar)
       .to.exist
  
  describe 'Panels', ()->

    choose   = -> toolbar.$(selector)
    panel    = new Transit.Panel()
    panel2   = new Transit.Panel()
    selector = "#transit_panel_#{panel.cid}"
    
    describe 'adding panels with Toolbar.add', ()->
      
      before ()-> toolbar.add(panel)
      after ()-> toolbar.drop(panel)
      
      it 'adds a panel to the toolbar node', ()->
        expect(toolbar.$(selector))
          .to.have.length.above(0)

      it 'adds a tab to the toolbar\'s tabBar', ()->
        expect(navbar.find("li[rel='#{panel.cid}']"))
          .to.have.length.above(0)
        
    describe 'removing panels with Toolbar.drop', ()->
        
      afterEach ()-> toolbar.reset()
      
      describe 'when there is only one panel', ()->
        
        beforeEach (done)-> 
          toolbar.add(panel)
          done()
          
        it 'removes the panel by object', (done)->
          toolbar.drop(panel)
          done()
          expect(toolbar.$(selector))
            .to.have.length(0)
          
        it 'removes the associated tab', (done)->
          toolbar.drop(panel)
          done()
          expect(navbar.find("li[rel='#{panel.cid}']"))
            .to.have.length(0)
  
      describe 'when there are multiple panels', ()->
        
        beforeEach (done)->
          toolbar.add(panel, panel2)
          done()
          
        it 'removes only the requested panel', (done)->
          toolbar.drop(panel)
          done()
          expect(toolbar.$('div.transit-panel'))
            .to.have.length.above(0)
      
        it 'removes only the associated tab', (done)->
          toolbar.drop(panel)
          done()
          expect(navbar.find("li"))
            .to.have.length.above(0)

    describe 'removing all panels with Toolbar.reset', ()->
      
      beforeEach (done)->
        toolbar.add(panel, panel2)
        done()
      
      it 'removes all panels', (done)->
        toolbar.reset()
        done()
        expect(toolbar.$('div.transit-panel'))
          .to.have.length(0)

      it 'removes all tabs', (done)->
        toolbar.reset()
        done()
        expect(navbar.find("li"))
          .to.have.length(0)