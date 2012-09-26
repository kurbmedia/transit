Transit = @Transit or require 'transit'

class Transit.Panel extends Transit.View
  className: 'transit-panel'
  title: 'Detail',
  icon: ''
  _tab: null
  
  template: ()-> ''
  constructor:->
    super
    for prop in ['title', 'icon', 'template']
      if @options[prop] isnt undefined
        @[prop] = @options[prop]
    
    if @$el.attr('id') is undefined
      @$el.attr("id", "transit_panel_#{@cid}")
    @$el.attr('rel', @cid)
  
module?.exports = Transit.Panel