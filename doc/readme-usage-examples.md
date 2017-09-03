
# Usage examples

## Default Options
```js
var mockServer = require('node-mock-server');
mockServer({});
```

## Custom Options

```js
var mockServer = require('node-mock-server');
var path = require('path');

mockServer({
  restPath: path.join(__dirname, '/mock/rest'),
  dirName: __dirname,
  title: 'Api mock server',
  version: 2,
  urlBase: 'http://localhost:3003',
  urlPath: '/rest/v2',
  port: 3003,
  uiPath: '/',
  funcPath: path.join(__dirname, '/func'),
  headers: {
    'Global-Custom-Header': 'Global-Custom-Header'
  },
  customDTOToClassTemplate: path.join(__dirname, '/templates/dto_es6flow.ejs'),
  middleware: {
    '/rest/products/#{productCode}/GET'(serverOptions, requestOptions) {
      var productCode = requestOptions.req.params[0].split('/')[3];

      if (productCode === '1234') {
        requestOptions.res.statusCode = 201;
        requestOptions.res.end('product 1234');
        return null;
      }

      return 'success';
    }
  },
  expressMiddleware: [
    function (express) {
      return ['/public', express.static(__dirname + '/public')];
    }
  ],
  swaggerImport: {
    protocol: 'http',
    authUser: undefined,
    authPass: undefined,
    host: 'petstore.swagger.io',
    port: 80,
    path: '/v2/swagger.json',
    dest: path.join(__dirname, '/mock/rest'),
    replacePathsStr: '/v2/{baseSiteId}',
    createErrorFile: true,
    createEmptyFile: true,
    overwriteExistingDescriptions: true,
    responseFuncPath: path.join(__dirname, '/func-imported')
  },
  open: true
});
```
