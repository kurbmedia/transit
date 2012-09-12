describe 'Manager window', ()->
  
  beforeEach ()-> 
    @item    = new Transit.Deliverable()
    @manager = Transit.manage(@item)
    @heading = @manager.$('h1')
  
  it 'is an instance of a Backbone.View', ()->
    expect(@manager instanceof Backbone.View)
      .toBeTruthy()