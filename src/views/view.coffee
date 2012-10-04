Backbone = @Backbone or require('backbone')
Transit  = @Transit or require('transit')
_ = this._ or require('underscore')

class Transit.View extends Backbone.View
  tagName: 'div'
  
  # immediate binding to model attributes
  bindings: {}
  
  # auto-render the view to a parent container
  container: null
  containerMethod: 'html'
  
  # was this view already closed?
  closed: false
  
  # helper functions and data to be passed to the template function
  helpers: {}
  
  # on close, remove the element?
  keep: false
  
  # track the parent view if exists
  manager: null
  
  # track any nested views
  subviews: {}

  # selector or template function
  template: null
  
  # disable the backbone wrapping el, useful for
  # when the template compiles to the entire view
  #
  wrapper: true
  
  constructor:()->
    Transit.runCallbacks.call(@, 'beforeInitialize')
    super
    
    updates = {}

    for selector, klass in @subviews
      view = new klass()
      view.container = @$el
      updates[view.cid] = view

    for name, val of @options
      if _.has(@, name) and val
        @[name] = val 
    
    if _.has @options, 'template'
      @template = @options.template

    @subviews = updates
    
  
  add:(views...)->
    @release(views)
    for view in views
      @$el.append(view.$el)
      @subviews[view.cid] = view
      view.manager = @
    if views.length is 1
      return views[0]
    else return views
      
  # closes a view completely. view.close() should always be used over .remove()
  close: (callback)->
    if @closed
      callback?()
      return @

    for cid, view of @subviews
      view.close()
    Transit.runCallbacks.call(@, 'beforeClose', 'beforeRemove')
    @$el.off('.transit')
    
    @remove() unless @keep is true
    
    unless @manager is null
      @manager.release(@)
      
    @closed = true
    @_unbindNodes()
    @trigger('close')

    for target in [@model, @collection, Transit]
      target.off(null, null, @) if target
    
    @getViews().each (view)-> view.close()
    @model = null
    @collection = null
    Transit.runCallbacks.call(@, 'afterRemove', 'afterClose')
    @trigger('closed')
    @off(null, null, @)
    callback?()
    @

  compile: ()->
    dfd = $.Deferred()
    if @template is null
      content  = ""
      @wrapper = true
      dfd.resolveWith(@, [content])
    else if _.isFunction(@template)
      dfd.resolveWith(@, [@template])
    else
      Transit.TemplateCache
        .get(@template)
        .then (data)=> dfd.resolveWith(@, [data])
    dfd.promise()
  
  detach:()=> 
    @$el.detach()
    @
  
  getViews:(callback)-> 
    views = _.chain(_.values(@subviews)).map((view)->
         return [].concat(view)
      , this).flatten()
    callback?(views.values())
    views
  
  prepend:(views...)->
    @add(views)
    for view in views
      view.$el.detach()
        .prependTo(@$el)
    if views.length is 1
      return views[0]
    else return views
  
  release:(views...)=>
    for view in views
      @subviews[view.cid] = null
      delete @subviews[view.cid]
      if $.contains(@$el.get(0), $(view.el).get(0)) and view.keep is false
        view.detach()
    if views.length is 1
      return views[0]
    else return views
  
  render: (callback)->
    @closed = false
    dfd = $.Deferred()
    @compile().then (tpl)=>
      content = Transit.render(tpl, @serialize())
      @trigger('render')
      Transit.runCallbacks.call(@, 'beforeRender')
      if @wrapper is true
        @$el.html(content)
      else 
        unless content is undefined
          @setElement($(content)) 
      
      unless @container is null
        $.fn[@containerMethod].call($(@container), @$el)
      Transit.runCallbacks.call(@, 'afterRender')
      @_bindNodes()
      @trigger('rendered')
      callback?()
      dfd.resolveWith(@, [@.el])

    dfd.promise()
    
  
  # creates an object to be passed to the template function
  serialize: ()->
    data = {}
    
    if @model
      data = _.extend(data, @model.toJSON())
    if @collection
      data = _.extend(data, { items: @collection.toJSON() })

    helpers = if _.isFunction(@helpers) 
      @helpers.call(@)
    else @helpers
    _.extend( helpers, data )
    
  # private
  
  _bindNodes:()->
    return @ unless @model
    for selector, attr of @bindings
      node = @$(selector)
      evt = if node.is('input, textarea, select') then "change.transit" else "blur.transit"
      model = @model
      @$el.on evt, selector, ()-> 
        props = {}
        props[attr] = node.val()
        model.set(props, { silent: true })

  _unbindNodes: ()-> @$(selector).off('.transit') for selector in _.keys(@bindings)

module?.exports = Transit.View