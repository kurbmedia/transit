describe 'Manager window', ()->
  
  item = new Transit.Deliverable()
  heading = null
  
  beforeEach ()-> 
    Transit.init(item)
    heading = Transit.Manager.$('h1')
  
  it 'creates a view for Transit.Manager', ()->
    expect(Transit.Manager instanceof Backbone.View)
      .toBeTruthy()

  describe 'attaching a model', ()->
    
    it 'assigns the model to @model', ()->
      expect(Transit.Manager.model)
        .toBe(item)