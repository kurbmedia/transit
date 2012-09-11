##
# Store a cache of items, this can be views, contexts, templates etc.
# Available objects are registered by name and type. 
# This allows easy lookup of options and other info when creating
# instances on the fly.

class Cache
  view: {}
  context: {}
  tpl: {}
  get: (type, name)=>
    type = type.toLowerCase()
    name = name.toLowerCase()
    found = @[type][name]
    if found is undefined then null else found
  
  set: (type, name, obj)=>
    type = type.toLowerCase()
    name = name.toLowerCase()
    @[type][name] = obj
  
  drop:(type, name)=>
    delete @[type][name]
    @

# General settings

Settings =
  template_path: '/transit/views'
  asset_path: '/transit/assets'

# Template management functionality

class Template
  compile:(html)=> _.template(html)
  load: (path, callback)=>
    exists = Transit.cache.get('tpl', path)
    return callback(exists) if exists isnt undefined
    $.get(@_pathify(path), (data)=>
      result = @compile(data)
      Transit.cache.set('tpl', path, result)
      callback(result)
    )
  set: (name, html)=>
    if typeof html is 'string'
      html = @compile(html)
    Transit.cache.set('tpl', name, html)
    @
  
  _pathify:(path)=>
    if path.indexOf(setting('template_path')) != -1 
      return path 
    else "#{setting('template_path')}/#{path.replace(/^\//, '')}"

Transit = @Transit = {}
Transit.cache    = new Cache()
Transit.config   = Settings
Transit.template = new Template()



# Allow configuration globally
Transit.setup = (options = {})-> 
  Transit.settings = _.extend(
    Transit.settings, options
  )

# Add an internal event system to share across everything
# include an additional "one" value similar to jQuery to run
# a callback once. 

Transit.on      = Backbone.Events.on
Transit.trigger = Backbone.Events.trigger
Transit.off     = Backbone.Events.off
Transit.one     = (events, callback, context)->
  callone = (args...)->
    callback(args...)
    Transit.off(events, callone, context)
  Transit.on(events, callone, context)

# Set and load from cache
Transit.set = Transit.cache.set
Transit.get = Transit.cache.get

# functions to be called on ready
_ready = false

jQuery(window).one('load', ()->
  _ready = true
  Transit.trigger("ready")
)

Transit.ready = (callback)-> Transit.one('ready', callback)

Transit.init = (model)->
  Transit.Manager.attach(model)
  Transit.trigger('init')
  
Transit.version = "0.3.0"

# Internal helper functions 
setting  = (name)-> Transit.config[name]

@Transit