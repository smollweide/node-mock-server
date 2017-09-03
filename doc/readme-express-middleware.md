# Express Middleware

For static content delivery beside the mock response itself, you can define express middleware.
Read more in [express documentation](http://expressjs.com/en/4x/api.html#app.use).

Each entry needs to be a function witch returns the `app.use` arguments.

```
expressMiddleware: [
  function (express) {
    return ['/public', express.static(__dirname + '/public')];
  },
  function (express) {
    return ['/dist', express.static(__dirname + '/dist')];
  }
],
```

Express result:
```
app.use('/public', express.static(__dirname + '/public'));
app.use('/dist', express.static(__dirname + '/dist'));
```

[example](/demo/options.js#L37)
