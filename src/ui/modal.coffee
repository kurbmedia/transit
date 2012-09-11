class @Transit.Modal extends Backbone.View
  @handler: (instance)-> 
    $(instance.$el).modal(show: true)
      .one 'hidden', (event)-> 
        Transit.trigger('modal:close', instance)
        instance.trigger('close')
        $('div.modal-backdrop:eq(0)').remove()
    
  tagName: 'div'
  className: 'transit-modal'
  events:
    'click a[data-action]' : 'perform'
  
  initialize: ->
    super
    @on('close', @remove, @)
    @options = _.defaults @options,
      buttons: []
      title: "Title Missing"
      content: "Content missing"
  
  close: ()=>
    @trigger('close')
    @remove()
    @

  perform: (event)=>
    event.preventDefault()
    link = $(event.currentTarget)
    Transit.trigger('modal:action', link.attr('data-action'), this)
  
  remove:()->
    @off()
    @trigger('remove')
    super
    
  render:()=> 
    Transit.tpl "/core/modal.jst", (template)=>
      el = $( template.render(@options) )
        .attr('id', "transit_modal_#{@cid}")
      @setElement(el)
      @trigger('open')
      Transit.trigger('modal:show', this)
      @$el.addClass('out')
      Transit.Modal.handler(this)
      @$el.removeClass('out')
        .addClass('in')
    @


@Transit.modal = (options = {}) ->
  view = new Transit.Modal(options)
  Transit.one 'modal:show', (mod)->
    return false unless mod is view
  view.render()
  view