describe 'Context', ()->
  
  describe 'any instance', ()->
    
    item = new Transit.Context()
    
    it 'assigns a .type value from the name', ()->
      expect(item.type)
        .toEqual('Context')
    
    it 'assigns a view object', ()->
      expect(item.view)
        .toBeDefined()