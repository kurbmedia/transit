Transit = @Transit or require('transit')

class Transit.Region extends Transit.View
  tagName: 'div'
  className: 'region'
  keep:true

  initialize: ()->
  beforeRender:()-> @wrapper = false unless @model.isNew()
    
  afterRender:()=>
    @$el.attr('data-deliverable-id', @model.id)
      .attr('data-deliverable-type', @model.type)
    @wrapper = true
    @update()
  
  update:()->
    @model.contexts.each (con)=>
      @release(con.view)
      @add(con.view)
      con.view.render() if con.isNew()

module?.exports = Transit.Region