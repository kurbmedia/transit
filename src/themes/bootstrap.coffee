Transit.Manager::template = Handlebars.compile '
  <h1 class="header">{{heading}}</h1>
  {{> transit_save_button}}
'
Transit.Toolbar::template = Handlebars.compile '
<div class="toolbar-inner">
    {{> transit_navbar}}
    <div class="panels">
    </div>
</div>
'
Handlebars.registerPartial 'transit_navbar', '
<div class="navbar">
  <div class="navbar-inner">
    <ul class="transit-nav-bar nav">
    </ul>
  </div>
</div>

'

Transit.Panel::template = Handlebars.compile '
<div class="transit-panel" id="{{cid}}">
</div>
'

Transit.Modal::template = Handlebars.compile '
<div class="modal fade">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h3>{{title}}</h3>
  </div>
  <div class="modal-body">
    {{{content}}}
  </div>
  <div class="modal-footer">
    {{#each buttons}}
      {{> transit_button}}
    {{/each}}
  </div>
</div>
'
Handlebars.registerPartial('transit_toolbar', Transit.Toolbar::template)
Handlebars.registerPartial('transit_button', '
<button class="btn {{css}}"{{#if action}} data-action="{{action}}{{/if}}">
  {{#if icon}}
  <i class="icon-ok"></i> 
  {{/if}}
  {{#if text}}{{text}}{{else}}Submit{{/if}}
</button>')

Handlebars.registerPartial('transit_save_button', '
<button class="save btn primary">
  <i class="icon-ok"></i> {{#if text}}{{text}}{{else}}Save{{/if}}
</button>')

$.fn.modal.Constructor::removeBackdrop = ()->
  @$backdrop.remove()
  @$backdrop = null

$.fn.modal.Constructor::backdrop = (callback)->
  that = @
  animate = if @$element.hasClass('fade') then 'fade' else ''

  if @isShown and @options.backdrop
    doAnimate = $.support.transition && animate
    @$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
      .appendTo($('#transit_ui'))
    
    unless @options.backdrop is 'static'
      @$backdrop.one('click', (=> @hide() ))

    if doAnimate 
      # force reflow
      @$backdrop[0].offsetWidth

    @$backdrop.addClass('in')

    if doAnimate
      @$backdrop.one($.support.transition.end, callback)
    else callback()

  else if !@isShown and @$backdrop
    @$backdrop.removeClass('in')
    if $.support.transition && @$element.hasClass('fade')
      @$backdrop.one($.support.transition.end, (=> @removeBackdrop()))
    else @removeBackdrop()

  else 
    callback?()
  @


# Transit.template.set("#{root}/core/toolbar.jst", '
#   <div class="transit-toolbar" id="transit_ui_toolbar">
#     <div class="toolbar-inner">
#       <h1>Manage Page</h1>
#     </div>
#   </div>
# ')

# Transit.Template.set("#{root}/core/tab-bar.jst", '
#   <ul class="transit-tab-bar nav nav-tabs"></ul>
# ')
# 
# Transit.Template.set("#{root}/core/pill-bar.jst", '
#   <ul class="transit-pill-bar nav nav-pills"></ul>
# ')
# 
# 
# # Alerts and notifications
# Transit.Template.set("#{root}/core/notification.jst", '
#   <div class="alert alert-<%= type %>">
#     <button type="button" class="close" data-dismiss="alert">×</button>
#     <%= message %>
#   </div>
# ')
# 
# Transit.Template.set("#{root}/core/modal.jst", '
#   <div class="modal fade">
#     <div class="modal-header">
#       <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
#       <h3><%= title %></h3>
#     </div>
#   <div class="modal-body">
#     <%= content %>
#   </div>
#   <div class="modal-footer">
#     <% _.each(buttons, function(button){ %>
#       <a href="#" class="btn <%= button.css %>" data-action="<%= button.action %>"><%= button.text %></a>
#     <% }); %>
#   </div>
# </div>
# ')
# 
# # Misc elements
# Transit.Template.set("#{root}/core/progress-bar.jst", '
#   <div class="progress progress-striped active">
#     <div class="bar" style="width:<%= percent %>"></div>
#   </div>
# ')
# 
# # Assets
# Transit.Template.set("#{root}/core/assets/image.jst", '
#   <img src="<%= asset.get("url") %>" />
#   <a href="#" class="icon-remove" data-action="remove"></a>
# ')
# 
# Transit.Template.set("#{root}/core/assets/file.jst", '
#   <a href="<%= asset.get("url") %>"><%= asset.get("filename") %></a>
#   <a href="#" class="icon-remove" data-action="remove"></a>
# ')
# 
# Transit.Template.set("#{root}/core/assets/uploader.jst", '')