describe 'Modal', ()->
  
  modal = null

  describe 'any instance', ()->

    describe '.perform', ()->
      spy  = null
      
      beforeEach ()->
        spy = jasmine.createSpy('perform')
        Transit.one('modal:action', spy)
        modal = Transit.modal()
        modal.perform(
          mockEvent(
            currentTarget: $('<a data-action="test"></a>')
          )
        )
      
      it 'triggers modal:action globally', ()->
        expect(spy)
          .toHaveBeenCalled()
      
      it 'passes the action and the modal to the callback', ()->
        expect(spy)
          .toHaveBeenCalledWith('test', modal)