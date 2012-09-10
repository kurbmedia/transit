describe 'Manager window', ()->
  
  item = new Transit.Deliverable()
  heading = null
  
  beforeEach ()-> 
    Transit.Manager.attach(item)
    heading = Transit.Manager.$('h1')
    
  
  it 'creates a view for Transit.Manager', ()->
    expect(Transit.Manager instanceof Backbone.View)
      .toBeTruthy()
  
  it 'creates a heading node', ()->
    expect(Transit.Manager.$('h1').length)
      .toNotEqual(0)

  it 'creates a tab-bar list', ()->
    expect(Transit.Manager.$('ul.transit-tab-bar').length)
      .toNotEqual(0)
   
  it 'creates a Panels instance', ()->
    expect(Transit.Manager.Panels instanceof Backbone.View)
       .toBeTruthy()

  describe 'attaching a model', ()->
    
    it 'assigns the model to @model', ()->
      expect(Transit.Manager.model)
        .toBe(item)
        
  describe '.setHeading', ()->
    
    beforeEach ()-> Transit.Manager.setHeading('Test')
    
    it 'sets the toolbar heading', ()->
      expect(heading.text())
        .toEqual("Test")