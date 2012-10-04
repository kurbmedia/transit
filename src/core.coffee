Backbone = @Backbone or require('backbone')
_ = this._ or require('underscore')

Transit  = null

###---------------------------------------
  Backbone Extensions
---------------------------------------### 

Backbone.Events.one = (events, callback, context)->
  bindCallback = _.bind(()->
    @unbind(events, bindCallback);
    callback.apply(context || @, arguments)
  , @)
  @bind(events, bindCallback)

for klass in [Backbone.Model, Backbone.View, Backbone.Collection]
  klass::one ||= Backbone.Events.one


###---------------------------------------
  Class
---------------------------------------### 

class Transit
  VERSION: "0.3.0"
  manager: null
  
  _initializers: []
  _cache: 
    context: {}

  compile: (data)-> _.template(data)
    
  get:(type, name)-> @_cache[type.toLowerCase()][name]
  
  initializer: (cb)=> 
    this._initializers.push(cb)
    @

  init: ()=> 
    @trigger('before:initialize')
    dfds = _.collect @_initializers.reverse(), (callback)->
      dfd = $.Deferred()
      callback(dfd.resolve)
      return dfd

      
    $.when.apply(null, dfds).then ()=>
      @trigger('after:initialize')
      @trigger('ready')

  manage: (model, callback)=>
    unless @manager is null
      @manager.close()
      @manager.model = model
    else @manager = new @Manager(model: model)
    @manager.render(callback)
    @manager

  render:(template, data)->
    if _.isString(template)
      return @compile(template)(data)
      
    if _.isFunction(template)
      return template(data)
    
    if _.isObject(template)
      return template.template(_.extend(data, template.data), template.options)(data)
    
    throw new Error("The template #{template} could not be rendered.")

  runCallbacks:(types...)->
    for type in _.unique(types)
      if @[type] then @[type]()

  set: (type, name, prop)->
    @_cache[type.toLowerCase()][name] = prop
    @
  
  end:()-> 
    @ui.close()
    @off(null, null, @)
    @

_.extend( Transit.prototype, Backbone.Events )

Transit = @Transit = new Transit()
  
###---------------------------------------
 Exports
---------------------------------------### 

@Transit ||= Transit
module?.exports = Transit