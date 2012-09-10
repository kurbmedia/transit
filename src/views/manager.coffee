###

The manager contains the global "shell" that contains
all additional ui elements

###

class Manager extends Backbone.View
  tagName: 'div'
  className: 'transit-ui'  
  events:
    'click button.save' : '_save'
  toolBar: null
  
  initialize:()-> Transit.one('init', @render)

  append:(node)-> @$el.append(node)
  
  attach:(model)-> @model = model; return @
  
  hide:()=> 
    @$el.addClass('hidden') 
    $('html').addClass('transit-ui-hidden')
      .removeClass('transit-ui-active')
    Transit.trigger('ui:hide')
    @
  
  prepend:(node)-> @$el.prepend(node)
  
  render:()=> 
    if $('#transit_ui').length is 0
      super
      $('html').addClass('transit-ui-hidden')
      @$el.addClass('hidden')
        .attr('id', 'transit_ui')
        .appendTo($('body'))
      if @toolBar is null
        @toolBar = Transit.Toolbar = new Transit.Toolbar()
        @append(@toolBar.$el)
    @

  show:()=> 
    @$el.removeClass('hidden')
    $('html').removeClass('transit-ui-hidden')
      .addClass('transit-ui-active')
    Transit.trigger('ui:show')
    @

  _save:(event)=>
    event.preventDefault() if event
    return false unless @model
    @model.save

##
# Expose object
#
Transit.Manager = new Manager()
module?.exports = Transit.Manager