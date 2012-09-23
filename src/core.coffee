Backbone = @Backbone or require('backbone')
_ = this._ or require('underscore')

Transit  = null
layout  = null

Backbone.Events.one = (events, callback, context)->
  bindCallback = _.bind(()->
    @unbind(events, bindCallback);
    callback.apply(context || @, arguments)
  , @)
  @bind(events, bindCallback)

for klass in [Backbone.Model, Backbone.View, Backbone.Collection]
  klass::one ||= Backbone.Events.one

class Transit extends Backbone.Marionette.Application
  VERSION: "0.3.0"
  one: Backbone.Events.one
  
Transit = new Transit()
Transit.manage = (model)->
  manager = new Transit.Manager(model: model)
  layout.interface.show(manager)
  @vent.trigger('manage', model, manager)
  manager

class Interface extends Backbone.Marionette.Layout
  tagName: 'div'
  className: 'transit-ui'
  id: 'transit_ui'
  template: _.template('<div id="transit_manager"></div>')
  regions:
    interface: '#transit_manager'

###---------------------------------------
  Initializers
---------------------------------------### 

##
# create the global interface layout
# which contains any editing functionality
#
Transit.addInitializer (options = {})->
   layout = new Interface()
   layout.render()
   $('body').append(layout.el)


###---------------------------------------
 Template fixes
---------------------------------------###
renderer = Backbone.Marionette.Renderer.render
Backbone.Marionette.Renderer.render = (template, data)->
  if _.isFunction(template)
    return template(data)
    
  if _.isObject(template) and template.type is 'handlebars'
    template.template(_.extend(data, template.data), template.options)
  renderer(template, data)


###---------------------------------------
 Exports
---------------------------------------### 

@Transit ||= Transit
module?.exports = Transit