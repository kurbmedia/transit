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
        
    describe 'when it has a view element', ()->
      
      beforeEach ()-> 
        Transit.Context.view = ContextView
        item = new Transit.Context()
      
      afterEach ()-> Transit.Context.view = Transit.View
      
      it 'creates a view from that element', ()->
        expect(item.view)
          .to.be.an.instanceof(ContextView)
    
    describe 'when it does not have a view element', ()->
      
      it 'creates a view from Transit.View', ()->
        expect(item.view).to.be
          .an.instanceof(Transit.View)
        
  
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
          .to.be.an.instanceof(Backbone.View)
      
    describe 'when a view is defined', ()->
        
      beforeEach ()-> 
        Transit.set('view', 'Audio', ()->)
        
      it 'assigns a view object', ()->
        expect(audio.view)
          .to.exist

        