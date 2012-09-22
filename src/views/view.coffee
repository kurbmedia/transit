Transit = @Transit or require('transit')

class Transit.View extends Backbone.View
  tagName: 'div'
  className: 'context'
  
  render:()=>
    @$el.attr('data-context-id', @model.id)
      .attr('data-context-type', @model.type)
    @
  
module?.exports = Transit.View