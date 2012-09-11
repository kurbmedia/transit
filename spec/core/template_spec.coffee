describe 'Templates', ()->
  
  beforeEach ()->
    Transit.Template.url = '/transit/views'
  
  it 'has a class level cache', ()->
    result = _.isObject(Transit.Template.cache)
    expect(result).toBeTruthy()
  
  describe '@pathify', ()->
    pathname = "/transit/views/core/test.jst"
    result   = ""

    describe 'when a path includes view_path', ()->
        
      beforeEach ()->
        result = Transit.Template.pathify(pathname)
        
      it 'returns the orignal path', ()->
        expect(result)
          .toEqual(pathname)
      
    describe 'when a path does not include view_path', ()->
      beforeEach ()->
        result = Transit.Template.pathify("/core/test.jst")
        
      it 'returns the path including view_path', ()->
        expect(result)
          .toEqual(pathname)
          
    describe 'setting a view directly with .set', ()->
      
      template = null
      
      beforeEach ()->
        Transit.Template.set('/spec/set.jst', "test")
        template = Transit.Template.find('/spec/set.jst')
      
      it 'should cache the set template', ()->
        expect(template)
          .toBeDefined()
      
      it 'sets the template path from the path', ()->
        expect(template.path)
          .toEqual('/transit/views/spec/set.jst')
      
      it 'sets the source from the source', ()->
        expect(template.source)
          .toEqual("test")
      
      it 'generates a compiled function', ()->
        expect(template.func instanceof Function)
          .toBeTruthy()
          
    
    describe 'compile', ()->
      
      it 'generates a compiled template', ()->
        template = Transit.Template.compile("test")
        expect(template instanceof Function)
          .toBeTruthy()