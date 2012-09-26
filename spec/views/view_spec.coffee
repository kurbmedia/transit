describe 'View', ()->
  class Unwrapped extends Transit.View
    template: Handlebars.compile("<span class='inner'></span>")
    className: 'test-view'
    wrapper: false
  
  view  = null
  unwrap = null
  
  beforeEach (done)->
    view   = new Transit.View({ className: 'test-view' })
    unwrap = new Unwrapped()
    unwrap.render(done)
  
  it 'should inherit Backbone.View', ()->
    expect(view).to.be
      .an.instanceof(Backbone.View)
  
  it 'should update locals from options if passed', ()->
    expect(unwrap.className)
      .to.equal('test-view')
    expect(unwrap.template())
      .to.match(/span/)
  
  describe 'when rendering', ()->
    
    callback = null
    deferred = null
    
    beforeEach (done)->
      callback = sinon.spy()
      deferred = sinon.spy()
      view.render(callback).then(deferred)
      done()
    
    it 'should run callbacks passed to .render', ()->
      expect(callback.callCount)
        .to.equal(1)
    
    it '.render should return a promise', ()->
      expect(deferred.callCount)
        .to.equal(1)
    
    it "passes the view's el to the resolved object", ()->
      expect(deferred.calledWith(view.el))
        .to.be.true
  
  describe '.wrapper', ()->
    
    describe 'when wrapper is false', ()->
      
      it 'sets the element to the innermost node', ()->
        expect(unwrap.el.tagName.toLowerCase())
          .to.equal('span')
      
      it 'does not wrap the el with the default tag', ()->
        expect(unwrap.$el.hasClass('test-view'))
          .to.be.false
    
    describe 'when wrapper is true', ()->
      
      beforeEach (done)->
        view.render(done)
    
      it 'wraps the template in the containing tag', ()->
        expect(view.$el.hasClass('test-view'))
          .to.be.true
        expect(view.el.tagName.toLowerCase())
          .to.equal('div')
    
  
  describe 'when closing', ()->
    
    callback = null
    beforeEach (done)->
      callback = sinon.spy()
      view.close(callback)
      done()
      
    it 'should run callbacks passed to .close', ()->
      expect(callback.callCount)
        .to.equal(1)
  
  describe 'serializing template data', ()->
    
    beforeEach ()->
      view.helpers = { helper: true }
    
    it 'includes the view helpers', ()->
      expect(view.serialize())
        .to.have.property('helper')
        .that.equals(true)
    
    describe 'when the view has a model', ()->
      
      beforeEach ()->
        view.model = new Backbone.Model({ test: true })
      
      it 'includes the model attributes', ()->
        expect(view.serialize())
          .to.have.property('test')
          .that.equals(true)
      
      it 'merges the model attributes and helpers', ()->
        expect(view.serialize())
          .to.have.property('helper')
          .that.equals(true)

          
    describe 'when the view has a collection', ()->
      
      beforeEach ()->
        view.collection = new Backbone.Collection([{ item: 1}, { item: 2 }])
      
      it 'includes an .items array from the collection', ()->
        expect(view.serialize())
          .to.have.property('items')
          .that.is.an('array')
      
      it 'merges the collection items and helpers', ()->
        expect(view.serialize())
          .to.have.property('helper')
          .that.equals(true)
      
    
  describe 'subviews', ()->
    
    describe '.getViews', ()->
      
      sub = new Transit.View()
      spy = null
      
      beforeEach (done)->
        spy = sinon.spy()
        view.add(sub).render(done)
      
      it 'returns a wrapped collection', ()->
        expect(view.getViews().each)
          .to.exist
      
      it 'accepts a callback function', ()->
        view.getViews(spy)
        expect(spy.called)
          .to.be.true
      
      it 'passes an array of views to the callback function', ()->
        view.getViews(spy)
        expect(spy.getCall(0).args[0])
          .to.include(sub)
    
    describe 'adding with view.add', ()->
      
      sub = new Transit.View()
      
      beforeEach (done)->
        view.add(sub).render(done)
      
      it 'adds the view to .subviews', ()->
        expect(view.subviews[sub.cid])
          .to.exist
        expect(view.subviews[sub.cid])
          .to.equal(sub)

      it 'adds the sub view element to the parent', ()->
        expect($.contains(view.el, sub.el))
          .to.be.true
      
      afterEach (done)-> sub.close(done)
    
    describe 'removing with view.release', ()->
      
      sub = new Transit.View()
      spy = null
      
      beforeEach (done)->
        spy = sinon.spy()
        view.add(sub).render(done)
      
      it 'removes the view from .subviews', ()->
        view.release(sub)
        expect(view.subviews[view.cid])
          .to.not.exist
          
    describe 'when closed', ()->

      sub = new Transit.View()
      spy = null
      
      beforeEach (done)->
        spy = sinon.spy(sub, 'close')
        view.add(sub).render(done)
      
      it 'closes all sub-views', (done)->
        view.close()
        done()
        expect(spy.called)
          .to.be.true
      
      afterEach ()-> spy.reset()