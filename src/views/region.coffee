Transit = @Transit or require('transit')

class Transit.Region extends Transit.View
  tagName: 'div'
  className: 'region'
  initialize: ()->
  afterRender:()=>
    @$el.attr('data-deliverable-id', @model.id)
      .attr('data-deliverable-type', @model.type)

module?.exports = Transit.Region