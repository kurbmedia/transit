describe 'Context collections', ()->
  
  class Audio extends Transit.Context
  class AudioView extends Transit.View
  
  describe '.load', ()->
    
    describe 'when a context has been setup', ()->
      
      describe 'and a view was provided', ()->
        
        beforeEach ()-> 
          Transit.Contexts.setup('Audio', { model: Audio, view: AudioView})
          @loaded = Transit.Contexts.load('Audio')
        
        it 'returns an object with model and view', ()->
          expect(@loaded)
            .to.include.keys('model', 'view')

        it 'returns the setup object for .model', ()->
          expect(@loaded.model)
            .to.equal(Audio)
        
        it 'returns the setup view for .view', ()->
          expect(@loaded.view)
            .to.equal(AudioView)
      
      describe 'and a view was not provided', ()->
        
        beforeEach ()->
          Transit.Contexts.setup('Audio', { model: Audio })
          @loaded = Transit.Contexts.load('Audio')
        
        it 'defaults Transit.View for the context view', ()->
          expect(@loaded.view)
            .to.equal(Transit.View)
    
    describe 'and a context has not been setup', ()->
      
      beforeEach ()->
        @loaded = Transit.Contexts.load('Missing')
      
      it 'defaults the model to Transit.Context', ()->
        expect(@loaded.model)
          .to.equal(Transit.Context)
      
      it 'defaults the view to Transit.View', ()->
        expect(@loaded.view)
          .to.equal(Transit.View)
        
      