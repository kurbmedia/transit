Backbone = @Backbone || require('backbone')
_ = @_ || require('underscore')
Transit = @Transit || require('transit')

class Transit.Context extends Backbone.Model
  type: null
  deliverable: null
  defaults:
    _type: null
    position: null
  
  view: null

  constructor:()->
    Transit.runCallbacks.call(@, 'before:initialize')
    super
    @_setType()
    view  = @view
    view  = Transit.ContextView if view is null
    @view = new view(@_view_options())

    @_bindView()
    @on('destroy', @_destroy)

  
  _setType:()->
    return @ unless @type is null
    if @get('_type') is null then @set('_type', @constructor.name) 
    @type = @get('_type')
  
  _bindView:()->
    @on 'change', (options)->
      @view.trigger('update') if @view
  
  # Options for constructing the view
  _view_options:()=>
    options = 
      model: @
    options.el = "[data-deliverable-id='#{@id}']" unless @isNew()
    options
  

module?.exports = Transit.Context