Transit.compile = (data)-> Handlebars.compile(data)

Transit.Manager::template = Handlebars.compile '
<h1 class="header">{{heading}}</h1>
{{> transit_save_button}}
'

Transit.Toolbar::template = Handlebars.compile '
<div class="navbar navbar-fixed-top navbar-inverse" id="transit_toolbar">
  <div class="navbar-inner">
    <ul class="transit-nav-bar nav">
    </ul>
  </div>
</div>
'

Handlebars.registerPartial 'transit_toolbar', Transit.Toolbar::template

Handlebars.registerPartial 'transit_toolbar_tab', '
<a href="#" class="{{css}}">{{{icon}}} {{{title}}}</a>
'
Transit.Panel::template = Handlebars.compile ''

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
Handlebars.registerPartial('transit_panels', '
<div class="panels">
</div>
')

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

Handlebars.registerPartial('transit_progress_bar', '
<div class="progress progress-striped active">
  <div class="bar" style="width:{{progress}}"></div>
</div>
')

Transit.AssetManager::template = Handlebars.compile '
<div class="add-asset">
  <button class="btn btn-small btn-primary"><i class="icon-plus icon-white"></i> Upload</button>
</div>
'

Transit.Uploader::template = Handlebars.compile '
  <h4>Upload Files</h4>
  <span class="ui-fileinput">
    <input type="file" name="file" />
    <var class="ui-value">Choose a file</var>
    <button class="btn btn-mini btn-primary">Choose</button>
  </span>
'

Transit.Notify::template = Handlebars.compile '
<div class="alert alert-{{type}}">
  <button type="button" class="close" data-dismiss="alert">×</button>
  {{{message}}}
</div>
'
# Transit.Template.set("#{root}/core/notification.jst", '
# ')

$.fn.modal.Constructor::removeBackdrop = ()->
  @$backdrop.remove()
  @$backdrop = null

$.fn.modal.Constructor::backdrop = (callback)->
  that = @
  animate = if @$element.hasClass('fade') then 'fade' else ''

  if @isShown and @options.backdrop
    doAnimate = $.support.transition && animate
    @$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
      .appendTo($('#transit_manager'))
    
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