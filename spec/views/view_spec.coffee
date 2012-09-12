describe 'the base view', ()->
  
  beforeEach ()-> 
    @model = new Transit.Context(id: 1) 
    @view  = new Transit.View(model: @model)
  
  it 'should inherit Backbone.View', ()->
    expect(@view)
      .toBeInstanceOf(Backbone.View)
  
  describe 'its element', ()->
    
    beforeEach ()-> @result = @view.render().$el
    
    it 'should add data-context-type with the model\'s type', ()->
      expect(@result.data('context-type'))
        .toBeDefined()
      expect(@result.data('context-type'))
        .toEqual('Context')

    it 'should add data-context-id with the model\'s id', ()->
      expect(@result.data('context-id'))
        .toBeDefined()
      expect(@result.data('context-id'))
        .toEqual(1)
    