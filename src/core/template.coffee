Transit = @Transit || require 'transit'

class Transit.Template
  @cache: {}
  @compile:(html)-> _.template(html)
  
  @find: (path)=>
    found = @cache[@pathify(path)]
    if found is undefined then false else found
    
  @pathify: (path)->
    if path.indexOf(@url) != -1 
      return path 
    else "#{@url}/#{path.replace(/^\//, '')}"
  
  @set: (path, html)=>
    path = @pathify(path)
    func = @compile(html)
    template = new Transit.Template(path, html, func)
    @cache[path] = template
    template
  
  @url: '/transit/views'
  path: ''
  source: ""
  func: null
  
  constructor:(path, html, func)->
    @path   = path
    @source = html
    @func   = func
    @

  render:(data)=>
    return @source if @func is null
    @func(data)


Transit.tpl = (path, callback)->
  path     = Transit.Template.pathify(path)
  existing = Transit.Template.find(path)
  
  if existing is false
    $.get path, (data)-> 
      template = Transit.Template.set(path, data)
      callback(template)
  else callback(existing)

module?.exports = 
  tpl: Transit.tpl
  Template: Transit.Template