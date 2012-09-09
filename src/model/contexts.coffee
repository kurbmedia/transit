##
# Context collection, added to a deliverables
#
class Contexts extends Backbone.Collection
  @build_as: 'contexts_attributes'
  _deliverable: null  
  
  # Set model type on initialize, this allows using
  # multiple model types in a single collection
  model: (data)-> 
    klass = Transit.get('context', data['_type'])
    if klass isnt null
      new klass(data)
    else new Transit.Context(data)
  
  
  
##
# Expose object
#
Transit.Contexts = Contexts
module?.exports  = Transit.Contexts