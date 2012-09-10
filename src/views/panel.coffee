class Panel extends Backbone.View
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

    @$el.attr("id", "transit_panel_#{@cid}")

  initialize:=>
    
  activate:()=> 
    @active = true
    @$el.addClass('active')

  deactivate:()=> 
    @active = false
    @$el.removeClass('active')
    
  remove:()=> 
    super
    @trigger('remove', @)

##
# Expose object
#
Transit.Panel   = Panel
module?.exports = Transit.Panel