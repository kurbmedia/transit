Transit = @Transit or require('transit')

class Transit.Region extends Backbone.Marionette.CollectionView
  tagName: 'div'
  className: 'region'
  initialize: ()->
    @collection = @model.contexts
  
  buildItemView:(model)-> @getItemView(model)
  getItemView:(model)-> model.view

  onRender:()=>
    @$el.attr('data-deliverable-id', @model.id)
      .attr('data-deliverable-type', @model.type)

module?.exports = Transit.Region