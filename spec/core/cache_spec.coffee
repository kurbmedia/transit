describe 'Cache', ()->
  
    it 'attaches itself to Transit', ()->
      expect(Transit.cache)
        .toBeDefined()
        
    lookup = (name)-> Transit.get('context', name)
    
    it 'stores items as an object, by type', ()->
      expect(Transit.cache.context)
        .toBeDefined()
    
    describe 'when an item is added', ()->
      
      beforeEach ()-> Transit.set('context', 'Sample', 'test')
      
      it 'is stored by the specified type', ()->
        expect(Transit.cache.context['sample'])
          .toBeDefined()
          
      it 'automatically lowercases the type', ()->
        expect(Transit.cache.context['Sample'])
          .toBeUndefined()
    
    describe 'when a item is requested', ()->
      
      describe 'and the item exists', ()->
        
        beforeEach ()-> Transit.set('context', 'Sample', 'test')
        
        it 'returns the item', ()->
          expect(lookup('sample'))
            .toBe('test')
      
        describe 'and the item does not exist', ()->
        
          it 'returns null', ()->
            expect(lookup('missing'))
              .toBeNull()        