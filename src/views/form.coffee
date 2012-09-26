Transit  = @Transit or require('transit')
Backbone = @Backbone or require('backbone')
_ = @_ or require('underscore')

class Transit.Form extends Transit.Panel
  className: 'transit-form transit-panel'
  events:
    'change input[data-binding]' : 'update'
    'blur input[data-binding]' : 'update'
  
  initialize: ()-> @bindTo(@, 'item:rendered', @setup)
    
  setup: ()->
    @bindTo(@model, 'change', @render)
    @$('input, textarea').each (i, node)=>
      view = new Transit.Form.Field({el: $(node), model: @model})
      @on 'close', (-> view.close())

  update:(event)->
    if event and event.currentTarget
      field = $(event.currentTarget)
      value = field.val()
      opts  = if event.type is 'blur' then { silent:true } else {}
      @model.set(field.data('binding'), value, opts)
      return @

class Transit.Form.Field extends Transit.View
  events:
    'change' : 'validate'
  binding: null
  
  initialize: ()->
    attr = @$el.data('binding')
    unless attr is undefined
      @binding = attr
      @bindTo(@model, "change:#{@binding}", @update)
    @update()

  validate: (event)->
    if @$el.is(':checkbox') or @$el.is(":radio")
      return @

  
  update:()->
    if @$el.is(":checkbox")
      if @model.get(@binding) then @$el.attr('checked', 'checked')
    else if @$el.is(":radio") && @model.get(@binding) is @$el.attr('value') then @$el.click()
    else @$el.val( @model.get(@binding) )
    

module?.exports = Transit.Form