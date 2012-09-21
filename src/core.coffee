ready   = false
Transit = null

class Transit extends Backbone.Marionette.Application
  version: "0.3.0"
  one: (events, callback, context)->
    callone = (args...)->
      callback(args...)
      @vent.off(events, callone, context)
    @vent.on(events, callone, context)
  
  set: (args...)-> @cache.set(args...)

Transit = new Transit()
Transit.manage = (model, callback)->
  delayed = ()-> 
    manager = new Transit.Manager(model: model)
    callback?(manager)
    manager
  
  if ready is true
    return delayed() 
  else @vent.on 'ready', (-> delayed(manager))
  @

# preload templates
Transit.addInitializer (options = {})->
  unless _.has options, 'preload'
    ready = true
    return true 
  
  # TODO, preload templates, callback to trigger ready


@Transit ||= Transit
module?.exports = Transit