Transit = @Transit or require('transit')

class Transit.Notify
  error:(message)=> @render(message, 'error')
  info:(message)=> @render(message, 'info')
  success:(message)=> @render(message, 'success')
  
  render:(message, type)=>
    $(@template({ message: message, type: type }))
      .addClass('transit-alert fade in')
      .appendTo($('#transit_manager'))
  


Transit.notify = (type, message)->
  notice = new Transit.Notify()
  notice[type](message)
  @

exports?.notify = Transit.notify
module?.exports = Transit.Notify