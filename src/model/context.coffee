Backbone = @Backbone || require('backbone')
_ = @_ || require('underscore')
Transit = @Transit || require('transit')

class Transit.Context extends Backbone.Model
  @build_as: 'contexts_attributes'
  type: null
  deliverable: null
  defaults:
    _type: null
    position: null
  
  view: null
  
  # track destroyed state, this allows add/delete of items 
  # without immediate removal server side.
  #
  _pendingDestroy: false

  initialize:()->
    super
    if @type is null
      if @get('_type') is null then @set('_type', @constructor.name) 
      @type = @get('_type')
    
    loaded = Transit.Contexts.load(@type)

    if @view is null
      options = { model: @ }
      if @isNew()
        options.el = ".managed-context[data-context-id='\#\{@id\}']" 
      @view = new loaded.view(options)
    
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
  

module?.exports = Transit.Context