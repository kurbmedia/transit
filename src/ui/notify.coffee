Transit = @Transit or require('transit')

class Transit.Notify
  error:(message)=> @render(message, 'error')
  info:(message)=> @render(message, 'info')
  success:(message)=> @render(message, 'success')
  
  render:(message, type)=>
    Transit.ui.append $(@template({ message: message, type: type }))
  


Transit.notify = (type, message)->
  notice = new Transit.Notify()
  notice[type](message)
  @

exports?.notify = Transit.notify
module?.exports = Transit.Notify