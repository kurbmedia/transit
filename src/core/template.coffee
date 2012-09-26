Transit = @Transit || require('transit')
_ = this._ || require("underscore")

class TemplateCache
  cache: {}
  get:(path)->
    $.Deferred((dfd)=>
      path ||= ""
      return dfd.resolve(@cache[path]) if @cache[path]
      if _.isFunction template
        @cache[path] = template
        return dfd.resolve(template)

      # dom script
      template = $("[data-template-name='#{path}']")
      if template.length is 0
        if (/\//).test(template)
          return $.get path, (data)=>
            @cache[path] = Transit.compile(data)
            dfd.resolve(@cache[path])
        else 
          @cache[path] = Transit.compile(path)
      else 
        @cache[path] = Transit.compile(template.html())

      dfd.resolve(@cache[path])
      
    ).promise()
  
  set:(path, template)->
  
  clear:(paths...)->
    delete @cache[path] for path in paths


Transit.TemplateCache = new TemplateCache()
module?.exports = Transit.TemplateCache