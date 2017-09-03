# Tunnel

The tunnel enables you to fetch, update ... data directly to the API.
The response from the API server will be stored in a "tunnel-latest.json" and "tunnel-latest-<code>.json" response file.
By using the collections you can easily switch between tunneling or not.

* `$ node <nodeScript> collections tunnel` will activate the tunnel everwhere
* `$ node <nodeScript> collections tunnel-latest` will activate all latest tunnel responses
* `$ node <nodeScript> collections reset` set all responses to default

[example](/demo/options.js#L57)
