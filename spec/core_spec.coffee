describe "Transit", ()->
  
  it 'creates a global object', ()->
    expect(window.Transit)
      .toBeDefined()
  
  describe 'on .init with model', ()->
    
    item = new Transit.Deliverable()
    
    beforeEach ()-> 
      Transit.init(item)
    
    it 'attaches the model to the ui', ()->
      expect(Transit.Manager.model)
        .toBe(item)
    
    it 'renders the interface', ()->
      expect($('#transit_ui').length)
        .toNotEqual(0)
  
  describe 'the .one event handler', ()->
    
    runs = 0
    beforeEach ()->
      Transit.one 'spec:init', ()->
        runs = runs + 1
      Transit.trigger('spec:init')
      Transit.trigger('spec:init')

    it 'only runs the callback once', ()->
      expect(runs).toEqual(1)
    
    
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
    
    describe '._pathify', ()->
      
      full_path = "#{Transit.config.template_path}/core/test.jst"
      result = ""
      
      describe 'when the path contains the template_path string', ()->
        
        beforeEach ()->
          result = Transit.template._pathify(full_path)
        
        it 'returns the orignal path', ()->
          expect(result)
            .toEqual(full_path)
      
      describe 'when the path does not contain template_path', ()->
        beforeEach ()->
          result = Transit.template._pathify("/core/test.jst")
        
        it 'returns the path including the template path', ()->
          expect(result)
            .toEqual(full_path)
      
    describe 'loading templates', ()->
      
      describe 'when the template is cached', ()->
        
        beforeEach ()->
          Transit.cache.set('tpl', 'test', 'test')
        
        it 'loads the cached template', ()->
          Transit.template
            .load('test', (result)-> 
              expect(result).toEqual('test')
            )
      
        afterEach ()-> 
          Transit.cache.drop('tpl', 'test')