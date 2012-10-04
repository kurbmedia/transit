Transit  = @Transit or require('transit')

class Transit.Toolbar extends Transit.View
  template: ()-> ''
  wrapper: false
  panels: {}
  manager: null
  list: null
  
  beforeClose:()->
    for cid, panel of @panels
      panel.close()
      delete @panels[cid]
  
  afterRender:()->
    if @$el.attr('id') is undefined then @$el.attr("id", "transit_toolbar")
    @list = @$('ul.transit-nav-bar')

  add:(panels...)=> 
    model  = @model
    for panel in panels
      panel.model = model if _.isUndefined(panel.model)  
      tab = new Tab(title: panel.title, icon: panel.icon)
      tab.panel  = panel.cid
      panel._tab = tab
      that = this
      
      activator = (wants)->
        that.list.find('li')
          .removeClass("active")
        for cid, view of that.panels
          if cid is wants
            if view.$el.hasClass('active')
              view.trigger('inactive')
              view.inactive?()
            else
              view.$el.addClass('active')
              view.active?()
          else
            if view.$el.hasClass('active')
              view.trigger('inactive')
              view.inactive?()
            view.$el.removeClass('active')
            

      tab.on 'activate', (-> activator(@panel))
      panel.on 'activate', (-> activator(@cid))

      panel.on 'inactive', ()->
        @$el.removeClass('active')
        @_tab.$el.removeClass('active')
        
      @list.append(tab.$el)
      tab.render()
      @panels[panel.cid] = panel
      Transit.manager.add(panel).render()

    if panels.length is 1
      return panels[0]
    else return panels
  
  prepend: (panels...)->
    @add(panels...)
    for panel in panels
      panel._tab.$el.detach()
        .prependTo(@list.$el)
    if panels.length is 1
      return panels[0]
    else return panels
    
  release:(panels...)->
    for panel in panels
      panel._tab.close() if panel._tab
      panel.close()
      delete @panels[panel.cid]

    if panels.length is 1
      return panels[0]
    else return panels

  reset:(callback)->
    for cid, panel of @panels
      panel.close()
      delete @panels[cid]
    @close()
    callback?()
    @

class Tab extends Transit.View
  tagName: 'li'
  template: "{{> transit_toolbar_tab}}"
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
