Transit = @Transit or require 'transit'

###

The Toolbar is the view that contains all of the editing / management
panels within the UI. Panels can be added/removed as necessary to extend the 
functionality of the manager.

###

class Transit.Toolbar extends Backbone.Marionette.Layout
  tagName: 'div'
  className: 'transit-toolbar'
  navbar: null
  regions:
    panels: 'div.panels:eq(0)'
  
  initialize:()-> @render()
        
  # add one or more panels with tabs
  add:(panels...)=> 
    self = @
    for panel in panels
      unless @navbar.find("li[rel='#{panel.cid}']").length isnt 0
        tab = new Tab(panel: panel.cid, title: panel.title, icon: panel.icon)
        @navbar.append( tab.render(panel).el )
        @panels.attachView(panel)
        mine = @
        tab.on 'active', ()-> 
          mine.navbar.find("li")
            .removeClass('active')
          @$el.addClass('active')
          mine.panels.show(@panel)

        tab.panel = panel
        panel.tab = tab

    if $('> li.active', @navbar).length is 0 then $('a:eq(0)', @navbar).click()
    
  # remove any number of panels
  drop:(panels...)=> 
    for panel in panels
      panel.close()
      panel.tab.close()
      delete panel.tab
      panel = null
    @
  
  onRender:()->
    @navbar       = @$('ul.transit-nav-bar')
    @panels.el    = @$('div.panels:eq(0)')
    @panels.getEl = (=> @$('div.panels:eq(0)'))
  
  # remove all panels
  reset:()=> 
    @panels.reset()
    @


class Tab extends Backbone.Marionette.ItemView
  template: ()-> ''
  tagName: 'li'
  events: 
    'click > a' : 'choose'
  
  panel: null
  
  initialize:()-> 
    @render()
    
  
  choose:(event)->
    event.preventDefault()
    @trigger('active', @)
  
  beforeClose:()-> 
    @$('i,a').off().remove()
    @panel = null
    
  onRender:()->
    options = _.pick( @options, 'class', 'icon', 'id', 'href', 'rel', 'target', 'title' )
    @$el.empty()
    link = $("<a></a>")
    for option, value of options
      switch option
        when 'class' then link.addClass(value)
        when 'title' then link.text(value)
        when 'icon'
          link.prepend $("<i></i>").addClass("icon-#{value}") unless value is ""
        else link.attr(option, value)

    @$el.append(link)
    @$el.attr('rel', @options.panel)
    @
  


@Transit.Toolbar = Transit.Toolbar
module?.exports  = Transit.Toolbar