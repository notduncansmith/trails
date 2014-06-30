# Trails

Just routing.


Trails is a tiny (2.4k unminified, 1.2k minified) client-side library for handling on-page routing.

The route parsing has been heavily borrowed from [Bogart](https://github.com/nrstott/bogart) - I just wanted client-side routing without having to pull in a framework like Backbone.


## Usage

Initialize Trails like so:

```js
var router = new Trails;
```


Now let's register a basic route.  Setting up a new route is pretty easy: 

```js
router.route('/', function (path) {
  // do stuff on the root rotue
});
```


The `path` argument passed to the route handler has the following properties:

- `params` (Object): The parameters passed via the URL

- `route` (String): The route signature that got handled

- `computed` (String): The actual path that was hit



An example using a parameter:

```js
router.route('/say/:message', function (path) {
  $('#message').text(path.params.message);
});
```


The splat (\*) operator is also supported:

```js
router.route('/text/*', function (path) {
  $('#body').text(path.splat)
})l
```


**Protip: Use router.allRoutes() to see all your current routes**

To run a function before any route handler is called, use before(): 

```js
router.before(function (path) {
  console.log('I get the same arguments as a route handler!');
});
```
You can also register functions to run after route handlers are called, using `after()`.  Trails supports multiple before/after handlers - they will be run in the order they were attached.


## Contributing

Trails is written in CoffeeScript.  Building the minified version is easy, just run `gulp`.

Outstanding TODOs in order of priority:

- Before/after hooks for routes

- ~~beforeAll/afterAll hooks~~

- ~~Gulpfile for compiling/minifying~~

- Landing page

- Example page (that isn't terrible)


Pull requests are welcome.

---

Copyright Duncan Smith 2013

MIT License
