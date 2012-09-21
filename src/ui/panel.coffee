class @Transit.Panel extends Backbone.Marionette.View
  tagName: 'div'
  className: 'transit-panel'
  title: 'Detail',
  icon: ''
  active: false
  
  constructor:->
    super
    for prop in ['title', 'icon']
      if @options[prop] isnt undefined
        @[prop] = @options[prop]
    
    if @$el.attr('id') is undefined
      @$el.attr("id", "transit_panel_#{@cid}")