# Using the node-mock-server UI

The mock server UI is available at _http://localhost:3003_ (or at the port you have defined via options).

If the service you want to mock provides a Swagger definition and you have provided a [`swaggerImport` configuration item](https://github.com/smollweide/node-mock-server/blob/c52adcf2a80999dd6876062006cf72c1ef124a78/demo/index.js#L41-L53), you may perform a Swagger import via the small triangle button in the top right of the UI page.
 
In the same location you find general preferences such as a response delay and you can trigger a validation of all responses.

In addition to Swagger imports, you may create resources manually using the **+add new endpoint** button at the bottom of the mock server UI page. You will be asked to enter a path, a http method and a description. The path must always begin with a slash and a path segment denoting the base url of the api. After the base url you can enter a sequence of more path segments separated by /. If path segments should be variables, use a parameter name in curly braces:

    /users                    points to the users api base url
    /users/{userid}/address   contains a path variable userid

Once a resource has been defined that way, you can continue to work with the resource and edit the possible responses. 

The UI shows you a list of known resources. Alongside each resource there are buttons which allow you to work with the responses for that method. 

Click the button for a ReST method (e.g. GET) to define possible responses for that method. A popup appears that shows the known responses and allows to add new responses. A newly created resource always has a set of default responses:

* empty.json
* error.json
* success.json
* middleware

Initially, empty.json, error.json and success.json contain an empty object as response. Click **open** to fill in the required response data.
The node-mock-server can also respond through a [middleware definition](https://github.com/smollweide/node-mock-server/blob/master/doc/readme-middleware.md); therefore you cannot edit a json file for it.

To enter a new response, hit *+add new response* to add a new response, e.g. `foo.json`. Your favorite text editor is fired up where you can enter the response. It will be stored as _foo.json_ inside the _mock_ directory.

For an error response the default HTTP status code is 500, but you can specify a different status code by suffixing the name of your error response with the appropriate status code, like `error-423.json`.

After storing the response you can select the radiobutton in front of your new response. A file _response.txt_ will be created alongside your possible responses, which stores your decision. All decisions can be captured, restored, reset and shared by means of a [collection](https://github.com/smollweide/node-mock-server/blob/master/doc/readme-collections.md).


