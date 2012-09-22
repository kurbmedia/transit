describe "Transit", ()->
  
  it 'creates a global object', ()->
    expect(Transit)
      .to.exist
  
  describe 'on .manage with model', ()->
    
    item   = new Transit.Deliverable()
    manage = Transit.manage(item)
    
    it 'returns an instance of the manager', ()->
      expect(manage)
        .to.be.an.instanceof(Transit.Manager)
    
    it 'renders the interface', ()->
      expect($('#transit_ui').length)
        .to.be.above(0)
  
  describe 'the .one event handler', ()->
    
    callback = null
    
    beforeEach ()->
      callback = sinon.spy()
      Transit.one('spec:init', callback)
      Transit.trigger('spec:init')
      Transit.trigger('spec:init')

    it 'only runs the callback once', ()->
      expect(callback.callCount)
        .to.equal(1)
