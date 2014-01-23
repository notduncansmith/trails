class window.Trails
  constructor: ->
    self = this
    window.onhashchange = (e) -> self._handle e.newURL
    window.onload = -> self._handle window.location

  routes: []

  route: (path, handler) ->
    originalPath = path
    args = Array.prototype.slice.call(arguments)
  
    path = args.shift()

    paramNames = path.match(/:([\w\d]+)/g) || []
    paramNames = paramNames.map (x) -> x.substring(1)

    path = new RegExp "^" + path.replace(/\./, '\\.').replace(/\*/g, '(.+)').replace(/:([\w\d]+)/g, "([^\/\?]+)") + '$'
    newRoute =
      path: path
      originalPath: originalPath
      handler: handler
      paramNames: paramNames
        
    this.routes.push(newRoute)

  vomit: ->
    this.routes

  _handle: (url) ->
    proxyAnchor = document.createElement 'a'
    proxyAnchor.href = url
    path = proxyAnchor.hash.replace '#!', ''

    route = this._match path
    unless route
      alert '404'

    params = {}
    routeParamValues = route.path.exec(path)

    if routeParamValues
      routeParamValues.shift() # Remove the initial match
      routeParamValues.map(decodeURIComponent).forEach (val, indx) ->
        if route.paramNames and route.paramNames.length > indx
          params[route.paramNames[indx]] = val
        else if val 
          params.splat = params.splat || []
          params.splat.push val
    
    args =
      route: route.originalPath
      computed: path
      params: params
    
    route.handler(args)
  
  _match: (path) ->

    route = {}

    for r in this.routes
      if path.match r.path || decodeURIComponent(path).match r.path 
        route = r

    route