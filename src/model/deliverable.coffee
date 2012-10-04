Transit  = @Transit or require('transit')
Backbone = @Backbone or require('backbone')
_ = @_ or require('underscore')

class Transit.Deliverable extends Backbone.Model
  contexts: null
  type: null
  view: null
  initialize:()-> 
    @type = @constructor.name if @type is null
    @contexts ||= new Transit.Contexts()
    @view ||= new Transit.Region(@_view_options())
    @on('change:contexts', @_build_contexts)
    @contexts.on 'add', (model)=>
      @view.add(model.view).render()
    
    @contexts.on 'remove', (model)=>
      model.view?.keep = false
      @view.release(model.view) if model.view
      model.view?.close()

    @_build_contexts()
    @
  
  # Process errors from JSON responses
  invalidate:(model, xhr, options)=> 
    if xhr and xhr.responseText
      response = $.parseJSON(xhr.responseText)
      if response['errors']
        for attr, messages of response.errors
          model.trigger("error:#{attr}", messages)

  # Override toJSON to provide a nested, rails-compatabile 
  # contexts_attributes hash
  
  toJSON: ->
    data = {}
    @contexts.each (con, index)-> data[index.toString()] = con.toJSON()
    result = {}
    result["#{Transit.Contexts.build_as}"] = data
    sends = {}
    sends[(@type || @get('_type')).toLowerCase()] = _.extend(super, result) 
    sends
  
  # Parse the contexts attributes into a collection
  _build_contexts:()=>
    contexts  = @attributes.contexts || []
    @contexts.reset(contexts)
    @unset('contexts', silent: true)
    @view?.update()
    @
  
  # Options for constructing the view
  _view_options:()=>
    options = 
      model: @
    options.el = "[data-deliverable-id='#{@id}']" unless @isNew()
    options
  


module?.exports = Transit.Deliverable