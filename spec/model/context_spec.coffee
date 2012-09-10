describe 'Context', ()->
  
  describe 'any instance', ()->
    
    item = new Transit.Context()
    
    it 'assigns a .type value from the name', ()->
      expect(item.type)
        .toEqual('Context')
    
    it 'assigns the _type attribute from the name', ()->
      expect(item.type)
        .toEqual('Context')
    
    it 'assigns a view object', ()->
      expect(item.view)
        .toBeDefined()
  
  describe 'a subclass', ()->
      
    class Audio extends Transit.Context
    audio = new Audio()
      
    it 'assigns a .type value from the name', ()->
      expect(audio.type)
        .toEqual('Audio')
      
    it 'assigns the _type attribute from the name', ()->
      expect(audio.get('_type'))
        .toEqual('Audio')

    describe 'when no view is defined', ()->
        
      it 'assigns a context view object', ()->
        expect(audio.view instanceof Backbone.View)
          .toBeTruthy()
      
    describe 'when a view is defined', ()->
        
      beforeEach ()->
        Transit.set('view', 'Audio', ()->)
        
      it 'assigns a view object', ()->
        expect(audio.view)
          .toBeDefined()
        
      afterEach ()-> delete Transit.cache.view['audio']
        