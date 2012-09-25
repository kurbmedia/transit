Transit = @Transit or require('transit')
Backbone = @Backbone or require('backbone')

class Transit.Asset extends Backbone.Model
  defaults:
    urls: []
    url: null
    filename: null

class Transit.Asset.Image extends Transit.Asset
  image: true
  defaults:
    _type: 'image'

class Transit.Asset.File extends Transit.Asset
  image: false
  defaults:
    _type: 'file'

module?.exports = Transit.Asset