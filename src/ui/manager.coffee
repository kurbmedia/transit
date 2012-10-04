Transit  = @Transit or require('transit')
Backbone = @Backbone or require('backbone')
_ = @_ or require('underscore')

class Transit.Manager extends Transit.View
  tagName: 'div'
  className: 'transit-manager'
  events:
    'click button.save': 'save'
  
  initialize: ()->
    @panels  ||= new Transit.Manager.Panels()
    @navbar  ||= new Transit.Manager.Navbar()
  helpers: ()-> 
    heading: "Manage #{@model.type}"
  
  add:(panels...)=> 
    model  = @model
    for panel in panels
      panel.model = model if _.isUndefined(panel.model)  
      tab = new Tab(title: panel.title, icon: panel.icon)
      tab.panel  = panel.cid
      panel._tab = tab
      that = @panels

      tab.on 'activate', ()->
        wants = @panel
        that.show()
        that.getViews().each (view)->
          if view.cid is wants
            view.$el.addClass('active')
            view.active?()
          else 
            view.$el.removeClass('active')
            view._tab.$el.removeClass('active')

      panel.on 'inactive', ()->
        that.hide()
        that.getViews().each (view)->
          view.$el.removeClass('active')
          view._tab.$el.removeClass('active')
        
      @navbar.add(tab).render()
      @panels.add(panel).render()
      
    if panels.length is 1
      return panels[0]
    else return panels
  
  beforeClose:()->
    @panels.close()
    @navbar.close()
    
  afterRender: ()->
    @panels.setElement(@$('div.panels:eq(0)')).render()
    @navbar.setElement(@$('ul.transit-nav-bar')).render()
  
  prepend: (panels...)->
    @add(panels...)
    for panel in panels
      panel.$el.detach()
        .prependTo(@panels.$el)
      panel._tab.$el.detach()
        .prependTo(@navbar.$el)
    if panels.length is 1
      return panels[0]
    else return panels
  
  save:()-> 
    @trigger("before:save")
    @model.save()
    @trigger("after:save")
    @
  
  release:(panels...)->
    for panel in panels
      panel._tab.close() if panel._tab
      panel.close()
    if panels.length is 1
      return panels[0]
    else return panels

  reset:(callback)->
    @panels.close()
    @navbar.close()
    callback?()
    @


class Tab extends Transit.View
  tagName: 'li'
  template: "{{> transit_navbar_tab}}"
  panel: null
  events: 
    'click a' : 'activate'
  
  activate:(event)->
    event.preventDefault() if event
    @$el.addClass('active')
    @trigger('activate')

  beforeClose:()-> @panel = null
  serialize:()->
    base = super
    base = _.defaults(super, { title: 'Tab' })
    base.css = _.compact(_.flatten([base.css]))
    options  = _.pick(@options, 'class', 'icon', 'title' )
    
    for option, value of options
      switch option
        when 'class' then base.css.push(value)
        when 'title' then base.title = value
        when 'icon'
          unless value is ""
            base.icon = $("<i></i>").addClass("icon-#{value}") + ""
    base

  afterRender:()-> @$el.attr('rel', @panel)


class Transit.Manager.Panels extends Transit.View
  tagName: 'div'
  className: 'panels'
  wrapper: false
  events: 
    'click span.close' : 'deactivate'
  
  show: ()->
    @$('span.close').show()
  
  hide: ()->
    @$('span.close').hide()

  afterRender:()->
    unless @$('span.close').length > 0
      @$el.append("<span class='close'>&times;</span>")
      @$('span.close').hide()
  
  deactivate:()->
    @getViews().each (view)->
      if view.$el.hasClass('active')
        view.trigger('inactive')
        view.inactive?()
    @

class Transit.Manager.Navbar extends Transit.View
  template: ()->
  wrapper: false

module?.exports  = Transit.Manager