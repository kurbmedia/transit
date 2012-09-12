class Cache
  view: {}
  context: {}
  tpl: {}
  get: (type, name)=>
    type = type.toLowerCase()
    name = name.toLowerCase()
    found = @[type][name]
    if found is undefined then null else found
  
  set: (type, name, obj)=>
    type = type.toLowerCase()
    name = name.toLowerCase()
    @[type][name] = obj
  
  drop:(type, name)=>
    delete @[type][name]
    @


@Transit.cache = new Cache()