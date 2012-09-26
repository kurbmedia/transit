describe "Transit", ()->
  
  it 'creates a global object', ()->
    expect(Transit)
      .to.exist
  
  it 'creates a .ui view element', ()->
    expect(Transit.ui)
      .to.be.an.instanceof(Backbone.View)
  
  describe 'render', ()->
    
    template = Handlebars.compile("<p><span>{{test}}</span><span>{{tester}}</span></p>")
    result   = Transit.render(template, { test: 'test1', tester: 'test2' })
    node     = $(result)
    
    it 'renders a template function into a string', ()->
      expect(result)
        .to.be.a('string')
      expect(result)
        .to.match(/span/)
    
    it 'passes object data to the template', ()->
      expect(node.find('span'))
        .to.have.length(2)
      expect(node.find('span:eq(0)').text())
        .to.equal("test1")
    
    
  describe 'on .manage with model', ()->
    
    item   = new Transit.Deliverable()
    manage = Transit.manage(item)
    
    it 'returns an instance of the manager', ()->
      expect(manage)
        .to.be.an.instanceof(Transit.Manager)
    
    it 'renders the manager', (done)->
      done()
      expect($('#transit_ui').length)
        .to.be.above(0)
      expect($('#transit_manager').is(":empty"))
        .to.be.false
    
    it 'adds the manager to the .ui', ()->
      expect(Transit.ui.subview)
        .to.exist
      expect(Transit.ui.subview)
        .to.equal(manage)
  
  describe 'the .one event handler', ()->
    
    callback = null
    
    beforeEach ()->
      callback = sinon.spy()
      Transit.one('spec:init', callback)
      Transit.trigger('spec:init')
      Transit.trigger('spec:init')

    it 'only runs the callback once', ()->
      expect(callback.callCount)
        .to.equal(1)