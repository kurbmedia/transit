describe 'Modal', ()->
  
  modal = null

  describe 'any instance', ()->

    describe '.perform', ()->
      spy  = null
      
      beforeEach ()->
        spy = sinon.spy()
        Transit.vent.on('modal:action', spy)
        modal = Transit.modal()
        modal.perform(
          currentTarget: $('<a data-action="test"></a>')
          preventDefault:()->
        )
      
      it 'triggers modal:action globally', ()->
        expect(spy.callCount)
          .to.equal(1)
      
      it 'passes the action and the modal to the callback', ()->
        expect(spy.calledWith('test', modal))
          .to.be.true