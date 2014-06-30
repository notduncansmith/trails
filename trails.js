window.Trails = (function() {
  Trails.prototype.options = {
    exceptionOnNotFound: true,
    redirectEmptyToRoot: true,
    onLoad: true
  };

  function Trails(options) {
    var o;
    for (o in options) {
      this.options[o] = options[o];
    }
    window.onhashchange = (function(_this) {
      return function(e) {
        var error;
        try {
          return _this._handle(e.newURL);
        } catch (_error) {
          error = _error;
          return console.error(error.message);
        }
      };
    })(this);
    if (this.options.onLoad) {
      window.onload = (function(_this) {
        return function() {
          var error;
          try {
            return _this._handle(window.location);
          } catch (_error) {
            error = _error;
            return console.error(error.message);
          }
        };
      })(this);
    }
  }

  Trails.prototype.routes = [];

  Trails.prototype.beforeAllHandlers = [];

  Trails.prototype.afterAllHandlers = [];

  Trails.prototype.route = function(path, handler) {
    var args, newRoute, originalPath, paramNames;
    originalPath = path;
    args = Array.prototype.slice.call(arguments);
    path = args.shift();
    paramNames = path.match(/:([\w\d]+)/g) || [];
    paramNames = paramNames.map(function(x) {
      return x.substring(1);
    });
    path = new RegExp("^" + path.replace(/\./, '\\.').replace(/\*/g, '(.+)').replace(/:([\w\d]+)/g, "([^\/\?]+)") + '$');
    newRoute = {
      path: path,
      originalPath: originalPath,
      handler: handler,
      paramNames: paramNames
    };
    return this.routes.push(newRoute);
  };

  Trails.prototype.before = function(func) {
    return this.beforeAllHandlers.push(func);
  };

  Trails.prototype.after = function(func) {
    return this.afterAllHandlers.push(func);
  };

  Trails.prototype.beforeAll = function() {
    var h, _i, _len, _ref, _results;
    _ref = this.beforeAllHandlers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      h = _ref[_i];
      _results.push(h());
    }
    return _results;
  };

  Trails.prototype.afterAll = function() {
    var h, _i, _len, _ref, _results;
    _ref = this.afterAllHandlers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      h = _ref[_i];
      _results.push(h());
    }
    return _results;
  };

  Trails.prototype.allRoutes = function() {
    return this.routes;
  };

  Trails.prototype._handle = function(url) {
    var args, params, path, proxyAnchor, route, routeParamValues;
    proxyAnchor = document.createElement('a');
    proxyAnchor.href = url;
    path = proxyAnchor.hash.replace('#!', '');
    if (path.length === 0) {
      if (this.options.redirectEmptyToRoot) {
        window.location.hash = '#!';
      } else {
        return false;
      }
    }
    route = this._match(path);
    if (!route.handler) {
      if (this.options.exceptionOnNotFound) {
        throw new Error("ONOEZ!  Could not find a matching route for " + path);
      } else {
        return false;
      }
    }
    params = {};
    routeParamValues = route.path.exec(path);
    if (routeParamValues) {
      routeParamValues.shift();
      routeParamValues.map(decodeURIComponent).forEach(function(val, indx) {
        if (route.paramNames && route.paramNames.length > indx) {
          return params[route.paramNames[indx]] = val;
        } else if (val) {
          params.splat = params.splat || [];
          return params.splat.push(val);
        }
      });
    }
    args = {
      route: route.originalPath,
      computed: path,
      params: params
    };
    if (this.beforeAllHandlers.length > 0) {
      this.beforeAll(args);
    }
    route.handler(args);
    if (this.afterAllHandlers.length > 0) {
      return this.afterAll(args);
    }
  };

  Trails.prototype._match = function(path) {
    var r, route, _i, _len, _ref;
    route = {};
    _ref = this.routes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      r = _ref[_i];
      if (path.match(r.path || decodeURIComponent(path).match(r.path))) {
        route = r;
      }
    }
    return route;
  };

  return Trails;

})();
