$ = @$ || Backbone.$

##
# Store a cache of items, this can be views, contexts, templates etc.
# Available objects are registered by name and type. 
# This allows easy lookup of options and other info when creating
# instances on the fly.

class Cache
  view: {}
  context: {}

  get: (type, name)=>
    type = type.toLowerCase()
    name = name.toLowerCase()
    found = @[type][name]
    if found is undefined then null else found
  
  set: (type, name, obj)=>
    type = type.toLowerCase()
    name = name.toLowerCase()
    @[type][name] = obj

# General settings

Settings =
  base_path: '/transit'
  view_path: '/views'

# Template management functionality

Template =
  _cache: {}
  compile:(html)->  _.template(html)
  load: (path, callback)->
    self = Transit.Template
    return callback(self[path]) if self[path] isnt undefined
    $.get("#{href(setting('view_path'))}/#{path}", (data)->
      result = self.compile(data)
      self[path] = result
      callback(result)
    )
  set: (name, html)->
    if typeof html is 'string'
      @_cache[name] = @compile(html)
    else @_cache[name] = html  


Transit = @Transit = {}
Transit.cache    = new Cache()
Transit.settings = Settings
Transit.Template = Template

# Allow configuration globally
Transit.setup = (options = {})-> 
  Transit.settings = _.extend(
    Transit.settings, options
  )

# Add an internal event system to share across everything
Transit.subscribe   = Backbone.Events.on
Transit.publish     = Backbone.Events.trigger
Transit.unsubscribe = Backbone.Events.off

# Set and load from cache
Transit.set = Transit.cache.set
Transit.get = Transit.cache.get  
  

@Transit = Transit

# Internal helper functions 
setting  = (name)-> Transit.settings[name]
href     = (path)-> "#{setting('base_path')}#{setting('view_path')}"
