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
    expect(Transit.Toolbar.$('ul.transit-tab-bar').length)
      .toNotEqual(0)
   
  it 'creates a tab bar instance', ()->
    expect(Transit.Toolbar.tabBar)
       .toBeDefined()
        
  describe '.set', ()->
    
    describe 'with "heading"', ()->
      
      beforeEach ()-> 
        Transit.Toolbar.set('heading', 'Test')
    
      it 'sets the toolbar heading', ()->
        expect(heading.text())
          .toEqual("Test")