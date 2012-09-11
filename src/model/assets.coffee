class @Transit.Assets extends Backbone.Collection
  model: ()-> Transit.Asset
  url: ()-> Transit.settings.asset_path
  fetch:(options = {})->
    options.data = @deliverable
    Backbone.Collection.prototype.fetch.apply(@, [options])
