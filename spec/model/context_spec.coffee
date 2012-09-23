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
    audio = new Audio()
      
    it 'assigns a .type value from the name', ()->
      expect(audio.type)
        .to.equal('Audio')
      
    it 'assigns the _type attribute from the name', ()->
      expect(audio.get('_type'))
        .to.equal('Audio')
    
    it 'inherits defaults', ()->
      expect(_.has(audio.defaults, 'position'))
        .to.equal(true)

    describe 'when no view is defined', ()->
        
      it 'assigns a context view object', ()->
        expect(audio.view)
          .to.be.an.instanceof(Transit.View)
      
    describe 'when a view is defined', ()->
        
      beforeEach ()-> Audio.view = Transit.View
        
      it 'assigns a view object', ()->
        expect(audio.view)
          .to.exist

        