###

All deliverables can contain one or more assets. 

###

class Asset extends Backbone.Model
  defaults:
    deliverable_id: null
    deliverable_type: null
    urls: []
    url: null
    image: true
    filename: null
  
  isImage:()-> @get('image')

class Assets extends Backbone.Collection
  model: Asset
  url: ()-> Transit.settings.asset_path
  fetch:(options = {})->
    options.data = @deliverable
    Backbone.Collection.prototype.fetch.apply(@, [options])

##
# Expose object
#
Transit.Asset   = Asset
Transit.Assets  = Assets
module?.exports = { Asset: Asset, Assets: Assets }