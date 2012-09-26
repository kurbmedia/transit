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
    view = @view
    options = { model:@ }
    options.el = ".managed-context[data-context-id='#{@id}']" unless @isNew()
    view = Transit.ContextView if view is null
    @view = new view(options)

    @_bindView()
    @on('destroy', @_destroy)
  
  # private
  
  _destroy:()->
    @off(null, null, @)
    @view.off(null, null, @)
    delete @view
  
  _setType:()->
    if @type is null
      if @get('_type') is null then @set('_type', @constructor.name) 
      @type = @get('_type')
  
  _bindView:()->
    @on 'change', (options)->
      @view.trigger('update') if @view
  

module?.exports = Transit.Context