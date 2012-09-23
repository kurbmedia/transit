describe 'the base view', ()->
  
  model = new Transit.Context(id: 1) 
  view  = new Transit.View(model: model)
  
  it 'should inherit Backbone.View', ()->
    expect(view).to.be
      .an.instanceof(Backbone.View)
  
  describe 'its element', ()->
    
    result = view.render().$el
    
    it 'should add data-context-type with the model\'s type', ()->
      expect(result.data('context-type'))
        .to.exist
      expect(result.data('context-type'))
        .to.equal('Context')

    it 'should add data-context-id with the model\'s id', ()->
      expect(result.data('context-id'))
        .to.equal(1)    