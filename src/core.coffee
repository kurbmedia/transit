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
  ui: null
  
  _initializers: []
  _cache: 
    context: {}

  constructor: ()-> @ui = new Interface()
  
  compile: (data)-> _.template(data)
    
  get:(type, name)-> @_cache[type.toLowerCase()][name]
  
  initializer: (cb)=> 
    callback = $.Deferred((dfd)-> cb(dfd.resolve)).promise()
    @_initializers.push(callback)
    @

  init: ()=> 
    @trigger('before:initialize')
    $.when.apply(null, @_initializers).then ()=>
      @trigger('after:initialize')
      @trigger('ready')

  manage: (model, callback)=>
    manager = new @Manager(model: model)
    @ui.setView(manager).render(callback)
    manager

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



class Interface extends Backbone.View
  tagName: 'div'
  className: 'transit-ui'
  id: 'transit_ui'
  subview: null
  rendered: false
  append: (element)=> @$el.append(element)
  close:()->
    @subview.close() unless @subview is null
    @off(null, null, @)
    @remove()

  render:()->
    return @ if @rendered is true
    @rendered = true
    @$el.append('<div id="transit_manager"></div>')
      .appendTo($('body'))
    @

  setView:(view)->
    unless @subview is null
      @subview.close?()
    @subview = view
    @subview.render().then (el)=>
      @$('#transit_manager').html(@subview.el)
    @subview

_.extend( Transit.prototype, Backbone.Events )

Transit = @Transit = new Transit()


###---------------------------------------
  Initializers
---------------------------------------### 

##
# create the global interface layout
# which contains any editing functionality
#
Transit.initializer (done)->
  Transit.ui.render()
  done()
  
###---------------------------------------
 Exports
---------------------------------------### 

@Transit ||= Transit
module?.exports = Transit