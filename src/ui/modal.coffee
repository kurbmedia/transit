Transit  = @Transit or require('transit')
Backbone = @Backbone or require('backbone')
_ = @_ or require('underscore')

class Transit.Modal extends Transit.View
  className: 'transit-modal'
  events:
    'click a[data-action],button[data-action]' : 'perform'

  wrapper: false
  
  afterRender:()->
    Transit.manager.add(@)
    @$el.attr('id', "transit_modal_#{@cid}")
      .addClass('out')
    @handler.call(@, true)
    @$el.removeClass('out')
      .addClass('in')
    
  beforeClose:()-> Transit.manager.release(@)

  handler: (open)-> 
    if open is true
      @$el.modal(show: true, backdrop: true)
        .one 'hidden', (event)=> 
          Transit.trigger('modal:close', @)
          @close()
    else @$el.modal('hide')
    @
  
  initialize: ->
    super
    @options = _.defaults @options,
      buttons: []
      title: "Title Missing"
      content: "Content missing"

  perform: (event)=>
    event.preventDefault()
    link = $(event.currentTarget)
    acts = link.attr('data-action')
    Transit.trigger('modal:action', acts, this)
    @trigger('modal:action', acts, this)
    if acts is 'close'
      @handler.call(@, false)
    @

  serialize: ()->  _.extend(super, @options)


Transit.modal = (options = {}) ->
  view = new Transit.Modal(options)
  Transit.one 'modal:show', (mod)->
    return false unless mod is view
  view.render()
  view

exports?.modal  = Transit.modal
module?.exports = Transit.Modal