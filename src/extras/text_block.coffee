Transit = @Transit or require('transit')

class TextBlock extends Transit.Context
  defaults:
    body: "heading text"

class TextBlockView extends Transit.ContextView
  template: Handlebars.compile("{{{body}}}")
  

TextBlock::view = TextBlockView
Transit.set('context', 'TextBlock', TextBlock)

module?.exports = TextBlock