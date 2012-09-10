###

The Toolbar is the view that contains all of the editing / management
panels within the UI. Panels can be added/removed as necessary to extend the 
functionality of the manager.

###

class Toolbar extends Backbone.View
  panels: []
  tabBar: null
  heading: null
  tagName: 'div'
  className: 'transit-toolbar'

  constructor:->
    super
    @$el.attr('id', 'transit_ui_toolbar')
    
  initialize:()-> 
    super
    @render()
  
  add:(panels...)-> 
    for panel in panels
      if _.indexOf(@panels, panel.cid, true) is -1
        @$('div.panels').append( panel.render().$el )
        @tabBar.append(panel.cid, panel.title)
        @panels.push(panel.cid)
        @panels = _.unique( @panels )
        
        panel.on 'active', ()=>
          @tabBar.find(panel.cid)
            .find('a').click()

        panel.on 'remove', ()=>
          @tabBar.remove(panel.cid)
  
  render:()->
    super
    @tabBar = new TabBar() if @tabBar is null
    
    @$el.append("<h1>Title</h1>")
      .append(@tabBar.el)
      .append("<div class='panels'></div>")
    @heading = @$('h1')
    @tabBar.el.find('a:eq(0)').click()
    @
    
  set: (prop, value)=>
    switch prop
      when 'heading' then @heading.html(value)
      else return false
    true

## Toolbar tabs

class TabBar
  el: null
  list: null
  tabs: {}
  constructor: -> 
    @tabs = {}
    @el   = $('
      <div class="navbar">
        <div class="navbar-inner">
          <ul class = "transit-tab-bar nav"></ul>
        </div>
      </div>'
    )
    @list = @el.find('ul.transit-tab-bar')
    @el.append(tab) for id, tab of @tabs
    @
  
  append:(args...)=> @list.append( @make(args...) )
  
  change: (next)=>
    $('li', @list).removeClass('active')
    return true if @find(next) is undefined
    @find(next).addClass('active')
    @
  
  find:(id)=> $(@tabs[id])
      
  insert:(at, args...)=>
    item = @make(args...) 
    if at < _.size @tabs
      return @el.append( item )
    @list.find('> li').eq(at)
      .after( item )
    
  make:(id, text, options = {})=> 
    item   = $('<li></li>')
    link   = $('<a></a>').text(text)
    
    return @tabs[id] if @tabs[id] isnt undefined
    
    for option, value of options
      switch option
        when 'class' then link.addClass(value)
        when 'icon'
          link.prepend $("<i></i>").addClass("icon-#{value}")
        else link.attr(option, value)
    
    link.attr( href: "#transit_panel_#{id}", "data-toggle": 'tab' )
      .text(text)
    item.append(link)

    @tabs[id] = item
    item
  
  prepend:(id, text, options = {})=> @list.prepend( @make(id, text, options) )
  
  remove:(id)=> @find(id).remove()

##
# Expose object
#
Transit.Toolbar = Toolbar
module?.exports = Transit.Toolbar