describe 'Deliverable', ()->
  item = null
  
  beforeEach ()-> item = new Transit.Deliverable()
  
  describe 'any instance', ()->
    
    it 'creates a contexts object', ()->
      expect(item.contexts)
        .to.exist
    
    it '.contexts is a Contexts collection', ()->
      expect(item.contexts)
        .to.be.an.instanceof(Transit.Contexts)
        
    it 'creates a region view', ()->
      expect(item.view)
        .to.exist
    
    it '.view is a Transit.Region', ()->
      expect(item.view)
        .to.be.an.instanceof(Transit.Region)
    
  describe 'building contexts from attributes', ()->
    
    beforeEach (done)->
      item.set('contexts', [
        { name: 'first',  _type: 'Context' },
        { name: 'second', _type: 'Context' }
      ])
      done()
    
    it 'converts the attributes to a collection', ()->
      expect(item.contexts.length)
        .to.equal(2)
    
    it 'removes the contexts attribute', ()->
      expect(item.get('contexts'))
        .to.not.exist

    afterEach ()-> item.contexts = new Transit.Contexts()
    
  describe 'generating json', ()->
    
    json = []
    
    before ()->
      item.set('contexts', [
        { name: 'first',  _type: 'Context' },
        { name: 'second', _type: 'Context' }
      ])
      json = item.toJSON()['page']
    
    it 'creates a key from Transit.Contexts.build_as', ()->
      expect(json['contexts_attributes'])
        .to.exist
    
    it 'uses context data as the value(s)', ()->
      expect(_.size(json['contexts_attributes']))
        .to.equal(2)