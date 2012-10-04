Transit  = @Transit or require('transit')
Backbone = @Backbone or require('backbone')
_ = @_ or require('underscore')

class Transit.Manager extends Transit.View
  tagName: 'div'
  className: 'transit-manager'
  events:
    'click button.save': 'save'
  
  initialize: ()-> 
    @toolbar ||= new Transit.Toolbar()
    @toolbar.manager = @

  helpers: ()-> heading: "Manage #{@model.type}"
  
  beforeClose:()-> @toolbar.close()
  
  afterClose: ()-> $('#transit_manager').remove()
  afterRender: ()->
    if $('#transit_manager').length is 0
      $('body').append(@$el)
      @$el.attr('id', 'transit_manager')

    @toolbar.render()
    @$el.append(@toolbar.$el)
  
  addTabs:(panels...)-> @toolbar.add(panels...)
  removeTabs:(panels...)-> @toolbar.release(panels...)
  reset:(callback)-> @toolbar.reset(callback)
    
  save:()-> 
    @trigger("before:save")
    @model.save()
    @trigger("after:save")
    @


module?.exports  = Transit.Manager