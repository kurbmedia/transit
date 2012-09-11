class @Transit.Asset extends Backbone.Model
  defaults:
    deliverable_id: null
    deliverable_type: null
    urls: []
    url: null
    image: true
    filename: null
  
  isImage:()-> @get('image')