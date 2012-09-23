describe 'Manager window', ()->
  
  item = new Transit.Deliverable()
  manager = null 
  
  it 'is an instance of a Marionette.Layout', ()->
    manager = Transit.manage(item)
    expect(manager).to.be.an.instanceof(
      Backbone.Marionette.ItemView
    )