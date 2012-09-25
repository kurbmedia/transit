Transit  = @Transit or require('transit')
Backbone = @Backbone or require('backbone')

class Transit.Assets extends Backbone.Collection
  model: (data)-> 
    klass = if data['_type'] is 'image' then Transit.Asset.Image else Transit.Asset.File
    delete data['_type']
    new klass(data)

  url: ()-> Transit.settings.asset_path


module?.exports = Transit.Assets