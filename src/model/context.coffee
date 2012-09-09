###

Context base class, all content contexts should inherit 
this model. Creates a default _type value, as well as 
sensible defaults for all models to inherit.

###

class Context extends Backbone.Model
  @build_as: 'contexts_attributes'
  view: null
  type: null
  
  # track destroyed state, this allows add/delete of items 
  # without immediate removal server side.
  #
  _pendingDestroy: false
  
  initialize:()->
    @_setType()
    
    if @view is null
      klass = Transit.get('view', @type)
      klass = Transit.get('view', 'Context') if klass is null

      if @isNew() then @view = new klass(model: @) 
      else @view = new klass(model: @, el: ".managed-context[data-context-id='\#\{@id\}']")
    
    @on('change', (options)->
      @view.trigger("change:#{name}") for name, value of options.changes
      @view.trigger('change')
    )
    
    @on('destroy', @cleanup)
    @view.render()
    @
  
  # private
  
  _cleanup:()=>
    @view.remove()
    delete @view
      
  _setType:()=> 
    return true unless @type is null
    @set('_type', @constructor.name) unless @has('_type')
    @type = @get('_type')


##
# Expose object
#
Transit.Context = Context
module?.exports = Transit.Context