$ = window.$ || Backbone.$

class Deliverable extends Backbone.Model
  contexts: null
  type: null
  view: null
  initialize:()-> 
    @type = @constructor.name if @type is null
    @view ||= new Transit.Region(@_view_options)
    @contexts ||= new Transit.Contexts()
    @on('change:contexts', @_build_contexts)
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
    { page: _.extend(super, result) }
  
  # Parse the contexts attributes into a collection
  _build_contexts:()=>
    contexts  = @attributes.contexts || []
    @contexts.reset(contexts)
    delete @attributes['contexts']
    @
  
  # Options for constructing the view
  _view_options:()=>
    options = 
      model: @
    options.el = "[data-region-id='\#\{@id\}']" if @isNew()
    options
  

##
# Expose object
#
Transit.Deliverable = Deliverable
module?.exports = Transit.Deliverable