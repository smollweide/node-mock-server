# Middleware

For validation and self controlled responses you can select middleware as response.
The middleware function will be called, in case of "middleware" is selected. It's response can be a string which will continue with the given string as selected response. If you return null or undefined you have to implement the response by yourself.

[example](/demo/options.js#L24)

## Parameter[0] serverOptions

See [node-mock-server options](/doc/readme-options.md)

## Parameter[1] responseOptions

| attribute     | type          | description  |
| ------------- | ------------- | ----- |
| req           | Object        | The (request object)[http://expressjs.com/en/api.html#req]. |
| res           | Object        | The (response object)[http://expressjs.com/en/api.html#res]. |
| method        | string        | Contains a string corresponding to the HTTP method of the request: GET, POST, PUT, and so on. |
| dir           | string        | The directory of selected response |
| preferences   | Object        | The preferences object |
