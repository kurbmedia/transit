Transit = @Transit or require 'transit'

class Transit.Manager extends Backbone.Marionette.Layout
  tagName: 'div'
  className: 'transit-ui'
  id: 'transit_ui'
  events:
    'click button.save' : 'save'

  toolBar: null
  
  initialize: ->
    super
    @toolBar = new Transit.Toolbar()
    @render()
    $('body').append(@el)
    @append(@toolBar.el)

  append:(node)-> @$el.append(node)
  
  hide:()=> 
    @$el.addClass('hidden') 
    $('html').addClass('transit-ui-hidden')
      .removeClass('transit-ui-active')
    Transit.vent.trigger('ui:hide')
    @
  
  prepend:(node)-> @$el.prepend(node)

  show:()=> 
    @$el.removeClass('hidden')
    $('html').removeClass('transit-ui-hidden')
      .addClass('transit-ui-active')
    Transit.vent.trigger('ui:show')
    @

  save:(event)=>
    event.preventDefault() if event
    return false unless @model
    @model.save

@Transit.Manager = Transit.Manager
module?.exports  = Transit.Manager