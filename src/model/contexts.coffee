Backbone = @Backbone || require('backbone')
_ = @_ || require('underscore')
Transit = @Transit || require('transit')

##
# Context collection, added to a deliverables
#
class Transit.Contexts extends Backbone.Collection
  @build_as: 'contexts_attributes'
  @subclasses: {}
  @load:(name)=> @subclasses[name] || { model: Transit.Context, view: Transit.ContextView }
  @setup:(name, store = {})=>
    model   = store.model || Transit.Context
    store   = _.defaults(store, { model: model, view: model::view || Transit.ContextView })
    current = @subclasses[name] || {}
    @subclasses[name] = _.extend( current, store)
    @

  _deliverable: null  
  
  # contexts always order by position
  comparator: (model)-> parseInt(model.get('position'))
  
  # Set model type on initialize, this allows using
  # multiple model types in a single collection
  model: (data)-> 
    klass = Transit.Contexts.load(data['_type'])
    new klass.model(data)


module?.exports  = Transit.Contexts