Transit  = @Transit or require('transit')
Backbone = @Backbone or require('backbone')
_ = @_ or require('underscore')

class Transit.Manager extends Backbone.Marionette.ItemView
  className: 'transit-manager'
  toolBar: null
  ui:
    heading: 'h1'
  
  events:
    'click button.save': 'save'

  templateHelpers: ()->
    options =
      heading: "Manage #{@model.type}"
    options

  initialize: -> @render()
  
  add:(panels...)-> 
    model  = @model
    panels = _.map panels, (panel)-> 
      panel.model ||= model
      panel

    @toolBar.add(panels...)
  
  onRender:()=>    
    @toolBar = new Transit.Toolbar()
    @$el.append @toolBar.el
  
  onClose:()=> @toolBar.close()
  
  drop:(panels...)-> @toolBar.drop(panels...)
  
  save:()-> 
    @trigger("before:save")
    @model.save()
    @trigger("after:save")
    @
  
  reset:()-> @toolBar.reset()

module?.exports  = Transit.Manager