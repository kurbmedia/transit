class @Transit.AssetManager extends Transit.Panel
  uploader: null
  collection: null
  
  images: null
  files:  null

  title: 'Assets'
  
  attach:(model)-> 
    @model = model
    if @model.assets is undefined
      @model.assets = new Transit.Assets()
    
  add:(asset)=>
    if asset.isImage()
      @images.add(asset)
    else @files.add(asset)

  render:()=>
    super
    @$el.addClass('transit-asset-manager')
    if @uploader is null
      @uploader = new Transit.Uploader()
      @$el.prepend( @uploader.render().$el )
    if @files is null
      @files  = new Transit.AssetManager.List(class: 'files')
    if @images is null
      @images = new Transit.AssetManager.List(class: 'images')
    @$el.append(@images.render().$el)
    @$el.append(@files.render().$el)
    @
  

class @Transit.AssetManager.List extends Backbone.View
  tagName: 'ul'
  initialize:->
    super
    if @options['class']
      @$el.addClass(@options['class'])
        
  add:(asset)=>
    item = new Transit.AssetManager.Item(model: asset)
    @$el.append(item.render.$el())
    

class @Transit.AssetManager.Item extends Backbone.View
  events:
    'click a[data-action="remove"]' : 'remove'
  tagName: 'li'
  type: null
  template: null
  initialize:()->
    @type = if @model.isImage() then 'image' else 'file'
    @$el.addClass(@type)
    Transit.tpl "/core/assets/#{@type}.jst", (templ)=>
      @template = templ
      @render()
  
  render:()=>
    @$el.html( @template(asset: @model))
  
  remove:()=>
    if confirm("Are you sure you want to delete this #{@type}?")
      @model.destroy()
      Transit.trigger('asset:removed', @model)
      super
    else false