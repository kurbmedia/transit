Backbone = @Backbone || require('backbone')
_ = @_ || require('underscore')
Transit = @Transit || require('transit')

class Transit.Context extends Backbone.Model
  type: 'Context'
  deliverable: null
  defaults:
    _type: null
    position: null
  
  view: null
  _destroyed: false
  
  constructor:()->
    Transit.runCallbacks.call(@, 'before:initialize')
    super
    @_setType()
    view  = @view
    view  = Transit.ContextView if view is null
    @view = new view(@_view_options())
    @_bindView()
      
  destroy:()->
    if @isNew()
      super
    else @_destroyed = true
    @
  
  toJSON:()->
    base = super
    base['_destroy'] = true if @_destroyed
    base
  
  _setType:()->
    unless @type is null or @type is undefined
      return @
    current = @get('_type')
    if current is null or current is undefined
      throw new Error("Contexts must declare a 'type' attribute.")
    @type = current
  
  _bindView:()->
    @on 'change', (options)->
      @view.trigger('update') if @view
  
  # Options for constructing the view
  _view_options:()=>
    options = 
      model: @
    options.el = "[data-context-id='#{@id}']" unless @isNew()
    options
  

module?.exports = Transit.Context