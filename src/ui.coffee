$ = window.$ || Backbone.$

###

The interface contains the global "shell" that contains
all additional ui elements

###

class Interface extends Backbone.View
  tagName: 'div'
  className: 'transit-ui'
  Toolbar: null
  regions: []
  
  initialize:()-> @Toolbar = new Toolbar()
  attach:(model)=> @model = model
  
  hide:()=> 
    @$el.hide()
    @

  render:()=> 
    if $('#transit_ui').length is 0
      super
      @$el.hide()
      .appendTo($('body'))
    @$el.append(@Toolbar.render().$el)

  show:=> 
    @render()
    @show()
    @

###

The interface includes one toolbar, which contains
action/command buttons for the active context

###

class Toolbar extends Backbone.View
  tagName: 'div'
  className: 'transit-toolbar'
  
  add:(item)=> 
    @$el.append($(item))
    @


##
# Expose object
#
Transit.UI = new Interface()
module?.exports = Transit.UI