class AssetManager extends Transit.Panel
  uploader: null
  collection: null
    
  render:()=>
    super
    @$el.addClass('transit-asset-manager')
    if @uploader is null
      @uploader = new Transit.Uploader()
      @$el.prepend( @uploader.render().$el )
    


##
# Expose object
#
Transit.AssetManager = AssetManager
module?.exports = Transit.AssetManager