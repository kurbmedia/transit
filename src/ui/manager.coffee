Transit = @Transit or require 'transit'

class Transit.Manager extends Backbone.Marionette.Layout
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
    @on('close', @toolBar.close)
    @$el.append @toolBar.el
  
  drop:(panel)-> @toolBar.drop(panel)
  
  save:()-> @model.save()

@Transit.Manager = Transit.Manager
module?.exports  = Transit.Manager