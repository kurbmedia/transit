describe 'Templates', ()->
  
  pathify = (path)-> Transit.Template.pathify(path)
  
  beforeEach ()-> Transit.Template.url = '/transit/views'
  
  it 'has a class level cache', ()->
    result = _.isObject(Transit.Template.cache)
    expect(result)
      .toBeTruthy()
  
  describe '@pathify', ()->
    
    beforeEach ()->
      @pathname = "/transit/views/core/test.jst"
    
    describe 'when a path includes view_path', ()->
        
      beforeEach ()->
        @result = pathify("/transit/views/core/test.jst")
        
      it 'returns the orignal path', ()->
        expect(@result)
          .toEqual(@pathname)
      
    describe 'when a path does not include view_path', ()->
      
      beforeEach ()->
        @result = pathify("/core/test.jst")
        
      it 'returns the path including view_path', ()->
        expect(@result)
          .toEqual(@pathname)
    
  describe 'template caching', ()->
    
    describe 'when a view is set with .set', ()->
      
      beforeEach ()->
        Transit.Template.set('/spec/set.jst', "test")
        @template = Transit.Template.find('/spec/set.jst')
      
      it 'should cache the set template', ()->
        expect(@template)
          .toBeDefined()
      
      it 'sets the template path from the path', ()->
        expect(@template.path)
          .toEqual('/transit/views/spec/set.jst')
      
      it 'sets the source from the source', ()->
        expect(@template.source)
          .toEqual("test")
      
      it 'generates a compiled function', ()->
        expect(@template.func instanceof Function)
          .toBeTruthy()
          
    
    describe 'compile', ()->
      
      beforeEach ()->
        @template = Transit.Template.compile("test")
      
      it 'generates a compiled template', ()->
        expect(@template instanceof Function)
          .toBeTruthy()