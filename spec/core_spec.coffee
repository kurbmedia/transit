describe "Transit", ()->
  
  it 'creates a global object', ()->
    expect(window.Transit)
      .toBeDefined()
  
  describe 'on .manage with model', ()->
    
    beforeEach ()-> 
      @item   = new Transit.Deliverable()
      @manage = Transit.manage(@item)
    
    it 'returns an instance of the manager', ()->
      expect(@manage instanceof Transit.Manager)
        .toBeTruthy()
    
    it 'renders the interface', ()->
      expect($('#transit_ui'))
        .toHaveSize(1)
  
  describe 'the .one event handler', ()->
    
    beforeEach ()->
      @callback = sinon.spy()
      Transit.one('spec:init', @callback)
      Transit.trigger('spec:init')
      Transit.trigger('spec:init')

    it 'only runs the callback once', ()->
      expect(@callback.callCount)
        .toEqual(1)
