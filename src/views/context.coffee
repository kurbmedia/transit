Backbone = @Backbone || require('backbone')
Transit  = @Transit or require('transit')

class Transit.ContextView extends Transit.View
  tagName: 'div'
  className: 'context managed-context'
  keep:true

  template: ()-> ''
  beforeRender:()-> @wrapper = false unless @model.isNew()
  afterRender:()->
    @$el.attr('data-context-id', @model.id)
      .attr('data-context-type', @model.type)
    @wrapper = true
    @
  
  beforeClose:()->
    @keep = false if @model.isNew()
  
  afterClose:()-> @keep = true

module?.exports = Transit.ContextView