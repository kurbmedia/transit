describe 'Manager window', ()->
  
  item = new Transit.Deliverable()
  heading = null
  manager = null
  
  beforeEach ()-> 
    manager = Transit.manage(item)
    heading = manager.$('h1')
  
  it 'is an instance of a Backbone.View', ()->
    expect(manager instanceof Backbone.View)
      .toBeTruthy()