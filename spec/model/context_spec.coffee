describe 'Context', ()->
  
  class ContextView extends Transit.View
  
  describe 'any instance', ()->
    
    beforeEach ()-> @item = new Transit.Context()
    
    it 'assigns a .type value from the name', ()->
      expect(@item.type)
        .toEqual('Context')
    
    it 'assigns the _type attribute from the name', ()->
      expect(@item.type)
        .toEqual('Context')
    
    it 'assigns a view object', ()->
      expect(@item.view)
        .toBeDefined()
        
    describe 'when it has a view element', ()->
      
      beforeEach ()-> 
        Transit.Context.view = ContextView
        @item = new Transit.Context()
      
      it 'creates a view from that element', ()->
        expect(@item.view)
          .toBeInstanceOf(ContextView)
    
    describe 'when it does not have a view element', ()->
      
      it 'creates a view from Transit.View', ()->
        expect(@item.view)
          .toBeInstanceOf(Transit.View)
        
  
  describe 'a subclass', ()->
      
    class Audio extends Transit.Context
    
    beforeEach ()-> @audio = new Audio()
      
    it 'assigns a .type value from the name', ()->
      expect(@audio.type)
        .toEqual('Audio')
      
    it 'assigns the _type attribute from the name', ()->
      expect(@audio.get('_type'))
        .toEqual('Audio')
    
    it 'inherits defaults', ()->
      expect(_.has(@audio.defaults, 'position'))
        .toBeTruthy()

    describe 'when no view is defined', ()->
        
      it 'assigns a context view object', ()->
        expect(@audio.view)
          .toBeInstanceOf(Backbone.View)
      
    describe 'when a view is defined', ()->
        
      beforeEach ()-> Transit.set('view', 'Audio', ()->)
        
      it 'assigns a view object', ()->
        expect(@audio.view)
          .toBeDefined()
        
      afterEach ()-> delete Transit.cache.view['audio']
        