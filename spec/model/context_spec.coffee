describe 'Context', ()->
  
  class ContextView extends Transit.View
  
  describe 'any instance', ()->
    
    item = new Transit.Context()
    
    it 'assigns a .type value from the name', ()->
      expect(item.type)
        .to.equal('Context')
    
    it 'assigns the _type attribute from the name', ()->
      expect(item.type)
        .to.equal('Context')
    
    it 'assigns a view object', ()->
      expect(item.view)
        .to.exist
        
  
  describe 'a subclass', ()->
    
    class Audio extends Transit.Context
      type: 'Audio'
    
    audio = new Audio()
    
    describe 'when a type property is set', ()->
      
      it 'uses the type property to describe the context', ()->
        expect(audio.type)
          .to.equal('Audio')
    
    describe 'when a type property is not set', ()->
      
      beforeEach -> Audio::type = null
      afterEach  -> Audio::type = 'Audio'
      
      describe 'and a _type attribute exists', ()->
        
        beforeEach -> audio = new Audio(_type: 'Audio')

        it 'assigns the type from the _type attribute', ()->
          expect(audio.type)
            .to.equal('Audio')
    
    it 'inherits defaults', ()->
      expect(_.has(audio.defaults, 'position'))
        .to.equal(true)

    describe 'when no view is defined', ()->
        
      it 'assigns a context view object', ()->
        expect(audio.view)
          .to.be.an.instanceof(Transit.ContextView)
      
    describe 'when a view is defined', ()->
        
      beforeEach ()-> Audio.view = Transit.ContextView
        
      it 'assigns a view object', ()->
        expect(audio.view)
          .to.exist