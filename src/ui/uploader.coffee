Transit = @Transit or require('transit')
Backbone = @Backbone or require('backbone')

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


class Transit.Uploader extends Backbone.Marionette.ItemView
  tagName: 'div'
  className: 'transit-uploader'
  @native: XHRUploadSupport()


module?.exports = Transit.Uploader