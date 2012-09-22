class @Transit.Modal extends Backbone.View
  handler: -> 
    @$el.modal(show: true)
      .one 'hidden', (event)=> 
        Transit.vent.trigger('modal:close', @)
        @trigger('close')
    @one 'modal:close', ()=> 
      @$el.modal('hide')
    
  tagName: 'div'
  className: 'transit-modal'
  events:
    'click a[data-action],button[data-action]' : 'perform'
  
  initialize: ->
    super
    @on('close', @remove, @)
    @options = _.defaults @options,
      buttons: []
      title: "Title Missing"
      content: "Content missing"
  
  close: ()=>
    @$el.trigger('hidden')
    @remove()
    @

  perform: (event)=>
    event.preventDefault()
    link = $(event.currentTarget)
    acts = link.attr('data-action')
    Transit.vent.trigger('modal:action', acts, this)
    @trigger('modal:close') if acts is 'close'

  
  remove:()->
    @off()
    @trigger('remove')
    super
    
  render:()=>
    modal = $(@template(@options))
    modal.attr('id', "transit_modal_#{@cid}")
    $('#transit_ui').append modal
    @setElement $("#transit_modal_#{@cid}")
    @trigger('open')
    Transit.vent.trigger('modal:show', this)
    @$el.addClass('out')
    @handler.apply(@)
    @$el.removeClass('out')
    .addClass('in')
    @


@Transit.modal = (options = {}) ->
  view = new Transit.Modal(options)
  Transit.one 'modal:show', (mod)->
    return false unless mod is view
  view.render()
  view