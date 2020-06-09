
# node-mock-server options

#### options.restPath
Type: `String`
Default value: `'./rest'`
Docker env: `REST_PATH`

A string value that defines the path to the rest API folder.


#### options.dirName
Type: `String`
Docker env: `DIR_NAME`

A string value that defines the root directory (__dirname).

#### options.title
Type: `String`
Default value: `Api mock server`

A string value that defines the title.

#### options.version
Type: `Number`
Default value: `1`

A number value that defines the Rest API version.

#### options.urlBase
Type: `String`
Default value: `http://localhost:3001`

A string value that defines the mock Rest API url.

#### options.urlPath
Type: `String`
Default value: `/rest/v1`
Docker env: `URL_PATH`

A string value that defines the path for the mock Rest API.

#### options.port
Type: `Number`
Default value: `3001`

A number value that defines the application port.

#### options.uiPath
Type: `string`
Default value: `/`
Docker env: `UI_PATH`

A string value that defines the path for the node-mock-server UI.

#### options.privateKey
Type: `String`

A string value that defines the path to the private key for ssl.

#### options.certificate
Type: `String`

A string value that defines the path to the ssl certificate.

#### options.funcPath
Type: `String|Array`
Optional

A string or array that define the location of the response functions.

#### options.headers
Type: `Object`
Default value: `{}`

A object that define the global response headers. Will add the given headers to all responses.


#### options.contentType
Type: `String`
Default value: `application/json`

A string that define the header "Content-Type".


#### options.accessControlExposeHeaders
Type: `String` or `function`
Default value: `X-Total-Count`

A string that define the header "Access-Control-Expose-Headers". If a function
is used, it will be called with the request object as the only parameter. 

#### options.accessControlAllowOrigin
Type: `String` or `function`
Default value: `*`

A string that define the header "Access-Control-Allow-Origin". If a function
is used, it will be called with the request object as the only parameter.

#### options.accessControlAllowMethods
Type: `String` or `function`
Default value: `GET, POST, PUT, OPTIONS, DELETE, PATCH, HEAD`

A string that define the header "Access-Control-Allow-Methods". If a function
is used, it will be called with the request object as the only parameter.

#### options.accessControlAllowHeaders
Type: `String` or `function`
Default value: `origin, x-requested-with, content-type`

A string that define the header "Access-Control-Allow-Headers". If a function
is used, it will be called with the request object as the only parameter.

#### options.accessControlAllowCredentials
Type: `String` or `function`
Default value: `true`

A string that define the header "Access-Control-Allow-Credentials". If a function
is used, it will be called with the request object as the only parameter.

#### options.middleware
Type: `Object`
Optional

A object including the middleware functions.
Read [middleware.md](/doc/readme-middleware.md) for details.

#### options.expressMiddleware
Type: `Array<Function<Array<path: string, callback: Function>>>`
Optional

A array of functions that returns the express `app.use` arguments.
Read [express middleware documentation](http://expressjs.com/en/api.html#app.use) for details.
examples:
* `expressMiddleware: [ function () { return ['/public', express.static('/public')]; } ]`
* `expressMiddleware: [ function () { return ['/public', function (req, res, next) {}]; } ]`
* `expressMiddleware: [ function () { return [function (req, res, next) {}] } ]`
* `expressMiddleware: [ function () { return function (req, res, next) {}; } ]`

#### options.swaggerImport
Type: `Object`
Optional

A object that define the swagger import.

#### options.swaggerImport.protocol
Type: `String`
Default value: `http`

A string that used to define the protocol for the swagger import curl.

#### options.swaggerImport.authUser
Type: `String`
Optional

A string that define the basic auth user for the swagger import curl.


#### options.swaggerImport.authPass
Type: `String`
Optional

A string that define the basic auth password for the swagger import curl.


#### options.swaggerImport.host
Type: `String`
Required

A string that define the host for the swagger import curl.


#### options.swaggerImport.port
Type: `String`
Default value: `80`

A string that define the port for the swagger import curl.


#### options.swaggerImport.path
Type: `String`
Default value: ``

A string that define the path for the swagger import curl.


#### options.swaggerImport.yaml
Type: `Boolean`
Default value: false

A flag that toggles whether the swagger file should be treated as a YAML file (otherwise: JSON).

#### options.swaggerImport.dest
Type: `String`
Required

A string that defines the destination path for the swagger import.

#### options.swaggerImport.replacePathsStr
Type: `String`
Default value: ``

A string that defines the part of the swagger imported methods path which should be removed.


#### options.swaggerImport.createErrorFile
Type: `Boolean`
Default value: `true`

A boolean to decide to create an expected response error file or not.

#### options.swaggerImport.createEmptyFile
Type: `Boolean`
Default value: `true`

A boolean to decide to create an expected response empty file or not.

#### options.swaggerImport.overwriteExistingDescriptions
Type: `Boolean`
Default value: `true`

A boolean to decide to replace an old description with the new (imported) description or not.

#### options.swaggerImport.responseFuncPath
Type: `String`

A string that defines the location of the imported response functions.

#### options.swaggerImport.agent
Type: `HttpProxyAgent|HttpsProxyAgent`
Optional

An agent to reach a swagger url outside a corporate proxy.

#### options.customDTOToClassTemplate
Type: `String`
Optional
Docker env: `CUSTOM_DTO_TO_CLASS_TEMPLATE`

A string that define the path to the custom DTO to class template.
[template](/src/templates/dto_es6flow.ejs)


#### options.open
Type: `Boolean`
Optional
Docker env: `OPEN`

A boolean to decide to open the UI after start or not.


#### options.optionsFallbackPath
Type: `String`
Optional
Docker env: `OPTIONS_FALLBACK_PATH`

A string that defines and enables the options fallback.
This allows you to define a fallback for every options call except there is one defined for the affected endpoint.


#### options.useTrailingSlashes
Type: `Boolean`
Optional

A boolean to decide to use trailing slashes in URL if your endpoints always ending with it.
