Transit  = @Transit or require('transit')
_ = @_ or require('underscore')

class Transit.Validator
  messages: 
    required: 'Required',
    regexp: 'Invalid',
    email: 'Invalid email address',
    url: 'Invalid URL',
    match: 'Must match field "{{field}}"'

Transit.validate = (input)->
  
exports?.validate = Transit.validate
module?.exports   = Transit.Validator