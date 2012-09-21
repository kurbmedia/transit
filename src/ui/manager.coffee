Transit = @Transit or require 'transit'

class Transit.Manager extends Backbone.View
  tagName: 'div'
  className: 'transit-ui'  
  events:
    'click button.save' : '_save'
  toolBar: null
  
  initialize:()-> 
    Transit.one('ready', @render)
    Transit.on('modal:show', @_modal)

  append:(node)-> @$el.append(node)
  
  manage:(model, resets = true)-> 
    @model = model
    if resets is true
      @toolBar.reset()
    @
  
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
      @toolBar = new Transit.Toolbar()
      @append(@toolBar.$el)
    @

  show:()=> 
    @$el.removeClass('hidden')
    $('html').removeClass('transit-ui-hidden')
      .addClass('transit-ui-active')
    Transit.trigger('ui:show')
    @

  _modal:(instance)=> @append( instance.$el )

  _save:(event)=>
    event.preventDefault() if event
    return false unless @model
    @model.save

module?.exports = Transit.Manager