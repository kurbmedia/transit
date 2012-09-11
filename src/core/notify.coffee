class Notify
  template: ()->
  constructor:()-> Transit.one('ready', @_setup)
  error:(message)=> @_render(message, 'error')
  info:(message)=> @_render(message, 'info')
  success:(message)=> @_render(message, 'success')
  
  _render:(message, type)=>
    Transit.Manager.append($(@template({ message: message, type: type })))

  _setup:()=> 
    Transit.template.load "/transit/views/core/notification.jst", (templ)=>
      @template = templ
  

##
# Expose object
#
Transit.Notify = new Notify()
module?.exports = Transit.Notify