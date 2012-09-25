Backbone = @Backbone || require('backbone')
Transit  = @Transit or require('transit')

class Transit.View extends Backbone.Marionette.ItemView
  tagName: 'div'
  
module?.exports = Transit.View