###

The Toolbar is the view that contains all of the editing / management
panels within the UI. Panels can be added/removed as necessary to extend the 
functionality of the manager.

###

class @Transit.Toolbar extends Backbone.View
  panels: {}
  tabBar: null
  heading: null
  tagName: 'div'
  className: 'transit-toolbar'

  constructor:->
    super
    @$el.attr('id', 'transit_ui_toolbar')
    
  initialize:()=> 
    super
    @panels = {}
    @render()
  
  # add one or more panels with tabs
  add:(panels...)=> 
    for panel in panels
      unless _.has(@panels, panel.cid) is true
        @$('div.panels').append( panel.render().$el )
        @tabBar.append(panel)
        @panels[panel.cid] = panel
        panel.on 'active', ()=>
          @tabBar.find(panel.cid)
            .find('a').click()

        panel.on 'remove', ()=>
          @tabBar.remove(panel.cid)
          Transit.trigger("panel:removed", panel)

        Transit.trigger("panel:added", panel)
  
  # render the toolbar
  render:()=>
    super
    @tabBar = new TabBar() if @tabBar is null
    
    @$el.append("<h1>Title</h1>")
      .append(@tabBar.el)
      .append("<div class='panels'></div>")
    @$el.wrapInner("<div class='toolbar-inner'></div>")
    @heading = @$('h1')
    @tabBar.el.find('a:eq(0)').click()
    @
  
  # remove a single panel
  remove:(panel)=>
    panel = @panels[panel] if _.isString(panel)
    return false if panel is undefined
    panel.remove()
    delete @panels[panel.cid]
    panel
  
  # remove all panels
  reset:()=>
    for cid, panel of @panels
      panel.remove()
      @tabBar.remove(panel.cid)
      delete @panels[cid]
    @$('div.panels > div.transit-panel').remove()
    @panels = {}
  
  # set a property or attribute on the toolbar
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
    Transit.tpl '/transit/views/core/nav-bar.jst', (templ)=>
      @el   = $(templ.render())
      @list = @el.find('ul.transit-nav-bar')
      @el.append(tab) for id, tab of @tabs
    @
  
  append:(panel)=> @list.append( @make(panel) )
  
  change: (next)=>
    $('li', @list).removeClass('active')
    return true if @find(next) is undefined
    @find(next).addClass('active')
    @
  
  find:(id)=> $(@tabs[id])
      
  insert:(at, panel)=>
    item = @make(panel) 
    if at < _.size @tabs
      return @el.append( item )
    @list.find('> li').eq(at)
      .after( item )
    
  make:(panel)=> 
    id     = panel.cid
    text   = panel.title
    item   = $('<li></li>')
    link   = $('<a></a>').text(text)
    
    options = _.pick(panel, 'class', 'icon', 'id', 'href', 'rel', 'target')
    
    return @tabs[id] if @tabs[id] isnt undefined
    
    for option, value of options
      switch option
        when 'class' then link.addClass(value)
        when 'icon'
          link.prepend $("<i></i>").addClass("icon-#{value}")
        else link.attr(option, value)
    
    if panel.$el.attr("id") is undefined
      panel.$el.attr('id', "#transit_panel_#{cid}")
    
    link.attr( href: panel.$el.attr('id'), "data-toggle": 'tab' )
      .text(text)
    item.append(link)
      .attr( id: "#transit_panel_tab_#{id}" )

    @tabs[id] = item
    item
  
  prepend:(panel)=> @list.prepend( @make(panel) )
  
  remove:(id)=> @find(id).remove()