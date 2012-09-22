Transit = @Transit or require 'transit'

class Transit.Panel extends Backbone.Marionette.ItemView
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

@Transit.Panel  = Transit.Panel
module?.exports = Transit.Panel