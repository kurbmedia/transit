Transit = @Transit or require 'transit'

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
  
  add:(panels...)-> @toolBar.add(panels...)
  
  onRender:()=>    
    @toolBar = new Transit.Toolbar()
    @$el.append @toolBar.el
  
  onClose:()=> @toolBar.close()
  
  drop:(panels...)-> @toolBar.drop(panels...)
  
  save:()-> @model.save()
  
  reset:()-> @toolBar.reset()

module?.exports  = Transit.Manager