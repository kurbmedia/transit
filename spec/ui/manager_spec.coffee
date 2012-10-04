describe 'Manager window', ()->
  
  item = new Transit.Deliverable()
  manager = null 
  panels  = null
  navbar  = null

  before (done)->
    manager = Transit.manage(item)
    done()

  beforeEach (done)->
    panels  = manager.panels
    navbar  = manager.navbar
    done()
    
  
  it 'is an instance of Transit.View', ()->
    expect(manager).to.be.an.instanceof(
      Transit.View
    )
  
  it 'creates a view for its panel container', ()->
    expect(manager.panels).to.be.an
      .instanceof(Transit.View)

  it 'creates a nav-bar list', ()->
    expect(manager.$('ul.transit-nav-bar'))
      .to.have.length.above(0)
   
  it 'creates a tab bar instance', ()->
    expect(manager.navbar)
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
      choose = -> panels.$(selector)
      done()
    
    describe 'adding panels with add', ()->
      
      before ()-> manager.add(panel)
      after (done)-> manager.reset(done)
      
      it 'adds a panel to the panels view', ()->
        expect(panels.$(selector))
          .to.have.length(1)
  
      it 'adds a tab to the navbar', ()->
        expect(navbar.$("li[rel='#{panel.cid}']"))
          .to.have.length(1)
    
    describe 'adding panels with prepend', ()->
      
      before (done)-> 
        manager.add(panel2)
        manager.prepend(panel)
        done()
        
      after (done)-> manager.reset(done)
      
      it 'prepends the to the panels view', ()->
        expect(panels.$el.children().eq(0).attr('id'))
          .to.equal("transit_panel_#{panel.cid}")
  
      it 'prepends a tab to the navbar', ()->
        expect(navbar.$("li:eq(0)").attr('rel'))
          .to.include(panel.cid)
        
    describe 'removing panels with .release', ()->
        
      afterEach ()-> manager.reset()
      
      describe 'when there is only one panel', ()->
        
        beforeEach (done)-> 
          manager.add(panel)
          done()
          
        it 'removes the panel by object', (done)->
          manager.release(panel)
          done()
          expect(panels.$(selector))
            .to.have.length(0)
          
        it 'removes the associated tab', (done)->
          manager.release(panel)
          done()
          expect(navbar.$("li[rel='#{panel.cid}']"))
            .to.have.length(0)
  
      describe 'when there are multiple panels', ()->
        
        beforeEach (done)->
          manager.add(panel, panel2)
          done()
          
        it 'removes only the requested panel', (done)->
          manager.release(panel)
          done()
          expect(panels.$('div.transit-panel'))
            .to.have.length(2)
      
        it 'removes only the associated tab', (done)->
          manager.release(panel)
          done()
          expect(navbar.$("li"))
            .to.have.length(1)
        
        afterEach (done)-> manager.reset(done)
  
    describe 'removing all panels with .reset', ()->
      
      beforeEach (done)->
        manager.add(panel, panel2)
        done()
      
      it 'removes all panels', (done)->
        manager.reset()
        done()
        expect(panels.$('div.transit-panel'))
          .to.have.length(0)
  
      it 'removes all tabs', (done)->
        manager.reset()
        done()
        expect(navbar.$("li"))
          .to.have.length(0)