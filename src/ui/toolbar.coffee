###

The Toolbar is the view that contains all of the editing / management
panels within the UI. Panels can be added/removed as necessary to extend the 
functionality of the manager.

###

class @Transit.Toolbar extends Backbone.Marionette.Layout
  heading: null
  tabBar: null
  tagName: 'div'
  className: 'transit-toolbar'
  id: 'transit_ui_toolbar'
  regions:
    panels: '> div.panels'

  initialize:()=> 
    @render()
    @panels.on "view:closed", (view)=>
      @tabBar.remove(view.cid)
    @heading = @$('h1')
  
  # add one or more panels with tabs
  add:(panels...)=> 
    for panel in panels
      if @tabBar.find(panel.cid) is undefined
        @tabBar.append(panel)
        opener = (event)=>
          event.preventDefault()
          @panels.show(panel)
        panel.tab.find('a')
          .on('click.transit', opener)
  
  # render the toolbar
  render:()=>
    super
    @tabBar = new Transit.Toolbar.TabBar() if @tabBar is null
    @tabBar.list.find('a:eq(0)').click()
    @
  
  # remove a single panel
  remove:(panel)=> panel.close()
  
  # remove all panels
  reset:()=> 
    @panels.reset()
    @tabBar.reset()
    @
  
  # set a property or attribute on the toolbar
  set: (prop, value)=>
    switch prop
      when 'heading' then @heading.html(value)
      else return false
    true

## Toolbar tabs

class @Transit.Toolbar.TabBar extends Backbone.View
  list: null
  tabs: {}
  
  initialize:-> @render()
  
  append:(panel)=> @list.append( @build(panel) )
  
  change: (next)=>
    $('li', @list).removeClass('active')
    return true if @find(next) is undefined
    @find(next).addClass('active')
    @
  
  find:(id)=> $(@tabs[id])
      
  insert:(at, panel)=>
    item = @build(panel) 
    if at < _.size @tabs
      return @el.append( item )
    @list.find('> li').eq(at)
      .after( item )
    
  build:(panel)=> 
    id     = panel.cid
    text   = panel.title
    item   = $('<li></li>')
    link   = $('<a></a>').text(text)
    options = _.pick(panel, 'class', 'icon', 'id', 'href', 'rel', 'target')
    
    return @tabs[id] if _.has @tabs, id
    
    for option, value of options
      switch option
        when 'class' then link.addClass(value)
        when 'icon'
          link.prepend $("<i></i>").addClass("icon-#{value}")
        else link.attr(option, value)
    
    link.attr( href: panel.$el.attr('id') )
      .text(text)
    item.append(link)
      .attr( id: "#transit_panel_tab_#{id}" )

    @tabs[id]  = item
    panel.tab = link
    item
  
  prepend:(panel)=> @list.prepend( @build(panel) )
  
  remove:(id)=> 
    item = @find(id)
    item.off('.transit')
      .find('a').off('.transit')
    delete @tabs[id]
    item.remove()
  
  render:=>
    @$el.remove() if @$el
    @$el = $(@template())
    @list = @$('ul.transit-nav-bar')
    @
  
  reset:=> @remove(pid) for pid, item in @tabs