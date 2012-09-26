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
        that.getViews().each (view)->
          if view.cid is wants
            view.$el.addClass('active')
            view.active() if view.active
          else 
            view.$el.removeClass('active')
            view._tab.$el.removeClass('active')
      @navbar.add(tab).render()
      @panels.add(panel).render()
      
    if @navbar.$('li.active').length is 0
      @navbar.$('a:eq(0)').click()

    if panels.length is 1
      return panels[0]
    else return panels
  
  beforeClose:()->
    @panels.close()
    @navbar.close()
    
  afterRender: ()->
    @panels.setElement(@$('div.panels:eq(0)')).render()
    @navbar.setElement(@$('ul.transit-nav-bar')).render()

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

class Transit.Manager.Navbar extends Transit.View
  template: ()->
  wrapper: false

module?.exports  = Transit.Manager