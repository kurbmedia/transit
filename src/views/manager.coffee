###

The manager contains the global "shell" that contains
all additional ui elements

###

class Manager extends Backbone.View
  tagName: 'div'
  className: 'transit-ui'  
  events:
    'click button.save' : '_save'
  
  heading: null
  tabBar: null
  panels: []
  
  initialize:()->
    @tabBar = new TabBar()
    Transit.one('init', @render)
  
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
        .append(@tabBar.el)
        .append("<div class='panels'></div>")
        .attr('id', 'transit_ui')
        .appendTo($('body'))
      @heading = @$('h1')
      @tabBar.el.find('a:eq(0)').click()
    @
  
  set: (prop, value)=>
    switch prop
      when 'heading' then @heading.html(value)
      else return false
    true

  show:()=> 
    @$el.removeClass('hidden')
    $('html').removeClass('transit-ui-hidden')
      .addClass('transit-ui-active')
    Transit.trigger('ui:show')
    @

  _save:(event)=>
    event.preventDefault() if event
    return false unless @model
    @model.save

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
Transit.Manager = new Manager()
module?.exports = Transit.Manager