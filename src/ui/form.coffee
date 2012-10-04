Transit  = @Transit or require('transit')
Backbone = @Backbone or require('backbone')
_ = @_ or require('underscore')

class Transit.Form extends Transit.Panel
  className: 'transit-form transit-panel'
  events:
    'change [data-binding]' : 'update'
    'blur [data-binding]' : 'update'
  
  afterRender:()->
    for prop, value of @model.attributes
      @$("[data-binding='#{prop}']").each (i, node)=>
        node = $(node)
        if node.is(":input") then node.val(value)
        else node.html(value)
    
  update:(event)->
    if event and event.currentTarget
      field = $(event.currentTarget)
      value = field.val()
      opts  = if event.type is 'blur' then { silent:true } else {}
      @model.set(field.data('binding'), value, opts)
      return @

module?.exports = Transit.Form