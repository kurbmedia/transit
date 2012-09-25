Transit = @Transit or require('transit')

class Transit.AssetManager extends Transit.Panel
  title: 'Assets'
  className: 'transit-panel transit-asset-manager'
  initialize:()-> @render()

module?.exports = Transit.AssetManager