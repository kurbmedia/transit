Transit = @Transit or require('transit')

class Transit.Region extends Backbone.Marionette.ItemView
  tagName: 'div'
  className: 'region'
  
  onRender:()=>
    @$el.attr('data-deliverable-id', @model.id)
      .attr('data-deliverable-type', @model.type)

module?.exports = Transit.Region