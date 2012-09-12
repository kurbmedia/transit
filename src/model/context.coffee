class @Transit.Context extends Backbone.Model
  @build_as: 'contexts_attributes'
  view: null
  type: null
  deliverable: null
  defaults:
    _type: null
    position: null
  
  # track destroyed state, this allows add/delete of items 
  # without immediate removal server side.
  #
  _pendingDestroy: false

  initialize:()->
    super
    if @type is null
      if @get('_type') is null then @set('_type', @constructor.name) 
      @type = @get('_type')

    if @view is null
      options = { model: @ }
      if @isNew()
        options.el = ".managed-context[data-context-id='\#\{@id\}']" 
      @view = if @constructor.view is undefined then new Transit.View(options) else new @constructor.view(options)
    
    @on('change', (options)->
      for name, value of options.changes
        @view.trigger("change:#{name}") 
      @view.trigger('change')
    )
    
    @on('destroy', @cleanup)
    @view.render()
    @
  
  # private
  
  _cleanup:()=>
    @view.remove()
    delete @view