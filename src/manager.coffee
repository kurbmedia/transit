$ = window.$ || Backbone.$

###

The manager contains the global "shell" that contains
all additional ui elements

###

class Manager extends Backbone.View
  tagName: 'div'
  className: 'transit-ui'  
  events:
    'click button.save' : '_save'
  Panels: null
  
  _heading: null
  _tabbar: null

  initialize:()->
    Transit.one('init', @render)
    @Panels = new Panels()
    @Panels.on('add', @_addTab)
    @Panels.on('remove', @_removeTab)
  
  add:(panels...)-> @Panels.add(panels...)
    
  append:(node)-> @$el.append(node)
  
  attach:(model)-> @model = model; return @
  
  hide:()=> 
    @$el.addClass('hidden') 
    $('html').addClass('transit-ui-hidden')
      .removeClass('transit-ui-active')
    Transit.trigger('ui:hide')
    @
  
  prepend:(node)-> @$el.prepend(node)
  
  render:()=> 
    if $('#transit_ui').length is 0
      super
      $('html').addClass('transit-ui-hidden')
      @$el.addClass('hidden')
        .append("<h1>Title</h1>")
        .append('<ul class="transit-tab-bar"></ul>')
        .attr('id', 'transit_ui')
        .appendTo($('body'))
      
      @$el.append( @Panels.render().$el )
      @_tabbar  = @$('ul.transit-tab-bar')
      @_heading = @$('h1')
    @
  
  setHeading:(text)=> @_heading.html(text)
  show:()=> 
    @$el.removeClass('hidden')
    $('html').removeClass('transit-ui-hidden')
      .addClass('transit-ui-active')
    Transit.trigger('ui:show')
    @

  _addTab:(panel)=>
    @_tabbar.append("
      <li class='tab' id='panel_tab_#{panel.cid}' data-panel='#{panel.cid}'>
        <a href='#', class='#{panel.icon}' data-panel='#{panel.cid}'>#{panel.title}</a>
      </li>"
    )
    
    @$("a[data-panel='#{panel.cid}']").on 'click', (event)=>
      $('li.tab a', @_tabbar).removeClass('active')
      event.preventDefault()
      panel.trigger('active')
    
  _removeTab:(panel)=> $("#panel_tab_#{panel.cid}").remove()

  _save:(event)=>
    event.preventDefault() if event
    return false unless @model
    @model.save

###

The interface contains one or more panels, which are used to 
edit / manage a deliverable and its contexts.

###

class Panels extends Backbone.View
  tagName: 'div'
  className: 'panels'
    
  initialize:()-> 
    @panels = []
    @on 'change', @change
    @add(arguments...)

  add: (panels...) => 
    for panel in _.flatten([panels])
      @_add(panel) 
    @

  change:(current, args...) =>
    for panel in @panels
      if panel is current
        panel.activate(args...)
      else
        panel.trigger('inactive')
        panel.deactivate(args...)
  
  removeAll:()=> @remove(@panels...)
  
  remove:(panels...)=> 
    for panel in _.flatten([panels])
      panel.remove()
    
  _add: (panel) =>
    panel.on 'active', (args...) =>
      $("#panel_tab_#{panel.cid}").addClass('active');
      @trigger('change', panel, args...)

    panel.on 'remove', (args...) =>
      if @panels.indexOf(panel) isnt -1
        @panels.splice(@panels.indexOf(panel), 1)
      @trigger('remove', panel, args...)
    
    @panels.push(panel)
    @trigger('add', panel)
    @$el.append( panel.render().$el )
  

class Panel extends Backbone.View
  tagName: 'div'
  className: 'transit-panel'
  title: 'Detail',
  icon: ''
  active: false
  
  initialize:-> _.bindAll(@)
  
  activate:()-> 
    @active = true
    @$el.addClass('active')

  deactivate:()-> 
    @active = false
    @$el.removeClass('active')
    
  remove:()-> 
    super
    @trigger('remove', @)

##
# Expose object
#
Transit.Manager = new Manager()
Transit.Panel   = Panel

module?.exports = { Panel:Panel, Manager:Manager }