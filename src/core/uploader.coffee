class Uploader extends Backbone.View
  tagName: 'div'
  className: 'transit-uploader'
  native: true

  constructor:->
    super
    @native = XHRUploadSupport()
    @$el.attr('id', 'transit_uploader')
    

# Support detection
XHRUploadSupport = ()->
  if XMLHttpRequest is undefined then return false
  xhr  = new XMLHttpRequest()
  return false if xhr['upload'] is undefined
  xhr.upload['onprogress'] isnt undefined

fileApiSupport = ()->
  input = document.createElement('INPUT');
  input.type = 'file'
  input['files'] isnt undefined

##
# Expose object
#
Transit.Uploader = new Uploader()
module?.exports = Transit.Uploader