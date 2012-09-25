Backbone = @Backbone || require('backbone')
Transit  = @Transit or require('transit')

class Transit.ContextView extends Transit.View
  tagName: 'div'
  className: 'context'
  template: ()->'item!'
  onRender:()->
    @$el.attr('data-context-id', @model.id)
      .attr('data-context-type', @model.type)
    @

module?.exports = Transit.ContextView