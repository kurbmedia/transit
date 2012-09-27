Backbone = @Backbone || require('backbone')
_ = @_ || require('underscore')
Transit = @Transit || require('transit')

##
# Context collection, added to a deliverables
#
class Transit.Contexts extends Backbone.Collection
  @build_as: 'contexts_attributes'

  # contexts always order by position
  comparator: (model)-> parseInt(model.get('position'))
  
  # Set model type on initialize, this allows using
  # multiple model types in a single collection
  model: (data)->
    klass = Transit.get('context', data['_type'])
    klass = Transit.Context if klass is null or klass is undefined
    new klass(data)


module?.exports  = Transit.Contexts