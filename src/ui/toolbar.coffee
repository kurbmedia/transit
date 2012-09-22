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
  
  events:
    "click ul.transit-nav-bar a" : 'change'
  
  views: {}
  
  initialize:()-> @render()
        
  # add one or more panels with tabs
  add:(panels...)=> 
    self = @
    for panel in panels
      unless _.has(@views, panel.cid)
        @navbar.append( Tab(panel) )
        @panels.attachView(panel)
        @views[panel.cid] = panel
    if $('> li.active', @navbar).length is 0
      $('a:eq(0)', @navbar).click()
  
  change: (event)->
    event.preventDefault()
    @navbar.find('li')
      .removeClass('active')
    link = $(event.currentTarget)
    link.parent('li')
      .addClass('active')
    @panels.show( @views[link.data('transit.panel_id')] )
    
  # remove a single panel
  drop:(panel)=> 
    panel.close()
    delete @views[panel.cid]
    $("li[rel='#{panel.cid}']", @navbar)
      .off()
      .remove()

    panel = null
  
  onRender:()->
    @navbar       = @$('ul.transit-nav-bar')
    @panels.el    = @$('div.panels:eq(0)')
    @panels.getEl = (=> @$('div.panels:eq(0)'))
  
  # remove all panels
  reset:()=> 
    @panels.reset()
    @


Tab = (panel)->
  options = _.defaults({ title: panel.title, href: '#' }, 
    _.pick( panel.options, 'class', 'icon', 'id', 'href', 'rel', 'target' )
  )
  
  link = $("<a></a>")
  for option, value of options
    switch option
      when 'class' then link.addClass(value)
      when 'title' then link.text(value)
      when 'icon'
        link.prepend $("<i></i>").addClass("icon-#{value}") unless value is ""
      else link.attr(option, value)

  link.data('transit.panel_id', panel.cid)
    .wrap("<li></li>")
  link.parent('li')
    .attr('rel', panel.cid)


@Transit.Toolbar = Transit.Toolbar
module?.exports  = Transit.Toolbar