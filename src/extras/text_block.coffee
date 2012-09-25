Transit = @Transit or require('transit')

class TextBlock extends Transit.Context
  defaults:
    body: "heading text"

class TextBlockView extends Transit.ContextView
  template: Handlebars.compile("{{{body}}}")
  

Transit.Contexts.setup('TextBlock', {
  model: TextBlock,
  view: TextBlockView
})

module?.exports = TextBlock