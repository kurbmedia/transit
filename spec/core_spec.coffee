describe "Transit", ()->
  
  it 'creates a global object', ()->
    expect(window.Transit)
      .toBeDefined()
  
  ##
  # Cache
  #
  describe 'Cache', ()->
    
    opts = {
      regions: ['full', 'basic']
    }
    
    lookup = (name)-> Transit.get('context', name)
    
    it 'stores items as an object, by type', ()->
      expect(Transit.cache.context)
        .toBeDefined()
    
    describe 'when an item is added', ()->
      
      beforeEach ()->
        Transit.set('context', 'Sample', opts)
      
      it 'is stored by the specified type', ()->
        expect(Transit.cache.context['sample'])
          .toBeDefined()
          
      it 'automatically lowercases the type', ()->
        expect(Transit.cache.context['Sample'])
          .toBeUndefined()
    
    describe 'when a item is requested', ()->
      
      describe 'and the item exists', ()->

        beforeEach ()->
          Transit.set('context', 'Sample', opts)
        
        it 'returns the item', ()->
          expect(lookup('sample'))
            .toBe(opts)
      
      describe 'and the item does not exist', ()->
        
        it 'returns null', ()->
          expect(lookup('missing'))
            .toBeNull()
  
  ##
  # Template
  #          
  describe 'Template', ()->
    
    describe 'loading templates', ()->
      
      describe 'when the template is cached', ()->
        
        beforeEach ()->
          Transit.Template._cache['test'] = "test"
        
        it 'loads the cached template', ()->
          Transit.Template
            .load('test', (result)-> 
              expect(result).toEqual('test')
            )
      
        afterEach ()-> Transit.Template._cache = {}
      
      describe 'when the template is not cached', ()->

        beforeEach ()-> 
          spyOn($, "get").andCallFake (path, callback)->
            callback('loaded-test')
          
          spyOn(Transit.Template, 'compile')
            .andCallFake((html)-> html)

        afterEach ()-> Transit.Template._cache = {}
        
        it 'loads the template via ajax', ()->
          Transit.Template
            .load('test2', (result)->
              expect(result).toEqual('loaded-test')
            )
