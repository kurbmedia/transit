Transit = @Transit or require('transit')

class HeadingText extends Transit.Context
  defaults:
    node: 'h2'
    body: "heading text"

class HeadingView extends Transit.ContextView
  tagName: ()=> @model.get('node')
  template: Handlebars.compile("{{body}}")
  

Transit.Contexts.setup('HeadingText', {
  model: HeadingText,
  view: HeadingView
})

module?.exports = HeadingText