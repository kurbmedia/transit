describe 'Deliverable', ()->
  
  item = new Transit.Deliverable()
  
  describe 'any instance', ()->
    
    it 'creates a contexts object', ()->
      expect(item.contexts)
        .toBeDefined()
    
    it '.contexts is a Contexts collection', ()->
      expect(item.contexts instanceof Transit.Contexts)
        .toBeTruthy()
        
    it 'creates a region view', ()->
      expect(item.view)
        .toBeDefined()
    
    it '.view is a Transit.Region', ()->
      expect(item.view)
        .toBeInstanceOf(Transit.Region)
    
  describe 'building contexts from attributes', ()->
    
    beforeEach ()->
      item.set('contexts', [
        { name: 'first',  _type: 'Context' },
        { name: 'second', _type: 'Context' }
      ])
    
    it 'converts the attributes to a collection', ()->
      expect(item.contexts.length)
        .toEqual(2)
    
    it 'removes the contexts attribute', ()->
      expect(item.get('contexts'))
        .toBeUndefined()
      
    afterEach ()-> item.contexts = new Transit.Contexts()
    
  describe 'generating json', ()->
    
    json = []
    
    beforeEach ()->
      item.set('contexts', [
        { name: 'first',  _type: 'Context' },
        { name: 'second', _type: 'Context' }
      ])
      json = item.toJSON()['page']
    
    it 'creates a key from Transit.Contexts.build_as', ()->
      expect(json['contexts_attributes'])
        .toBeDefined()
    
    it 'uses context data as the value(s)', ()->
      expect(_.size(json['contexts_attributes']))
        .toEqual(2)