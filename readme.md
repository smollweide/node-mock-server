
# node-mock-server

> File based Node REST API mock server

[![Build status](https://img.shields.io/travis/smollweide/node-mock-server/master.svg)](https://travis-ci.org/smollweide/node-mock-server)
[![Build status](https://ci.appveyor.com/api/projects/status/tfluudfe4s7810w8/branch/master?svg=true)](https://ci.appveyor.com/project/smollweide/node-mock-server/branch/master)
[![Dependencies](https://img.shields.io/david/smollweide/node-mock-server/master.svg)](https://david-dm.org/smollweide/node-mock-server)
[![npm](https://badge.fury.io/js/node-mock-server.svg)](https://badge.fury.io/js/node-mock-server)
[![npm](https://img.shields.io/npm/dt/node-mock-server.svg)](https://www.npmjs.com/package/node-mock-server)
[![Codestyle](https://img.shields.io/badge/codestyle-namics-green.svg)](https://github.com/namics/eslint-config-namics)

![node-mock-server-ui.png](https://cloud.githubusercontent.com/assets/2912007/26034363/c509d2c2-38bb-11e7-9175-4a151f7a550f.jpg)

## Features
- Node.js and file based ([folder structure](/doc/readme-folder-structure.md))
- API documentation UI
- [Functions in mock data](/doc/readme-mock-functions.md)
- [HTTP status code in mock data](/docs/readme-mock-status.md)
- [Faker included](/doc/readme-faker.md)
- [Query params in mock data](/doc/readme-query-params.md)
- [Dynamic path params in mock data](/doc/readme-path-params.md)
- [Expected responses](/doc/readme-expected-response.md)
- [Middleware responses](/doc/readme-middleware.md)
- [Error cases](/doc/readme-expected-response.md)
- [Swagger import](/doc/readme-swagger-import.md)
	- DTO import
	- DTO response function
- [Response validation](/doc/readme-response-validation.md)
- [Response header](/doc/readme-response-header.md)
- [DTO to Class converter](/doc/readme-dto-2-class.md)
- [Collections](/doc/readme-collections.md)

## Getting Started
This application requires Node `4` or higher
for Node `<4` please use `node-mock-server@0.11.0`

* `npm install node-mock-server --save-dev` or `yarn add node-mock-server --dev`
* .gitignore add `<restPath>/*/*/*/mock/response.txt`

```js
var mockServer = require('node-mock-server');
mockServer(options);
```

### Options
[node-mock-server options](/doc/readme-options.md)

### Usage Examples

#### Default Options

```js
var mockServer = require('node-mock-server');
mockServer({});
```

#### Custom Options

```js
var mockServer = require('node-mock-server');
mockServer({
	restPath: __dirname + '/mock/rest',
	dirName: __dirname,
	title: 'Api mock server',
	version: 2,
	urlBase: 'http://localhost:3003',
	urlPath: '/rest/v2',
	port: 3003,
	funcPath: __dirname + '/func',
	headers: {
		'Global-Custom-Header': 'Global-Custom-Header'
	},
	customDTOToClassTemplate: __dirname + '/templates/dto_es6flow.ejs',
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
	swaggerImport: {
		protocol: 'http',
		authUser: undefined,
		authPass: undefined,
		host: 'petstore.swagger.io',
		port: 80,
		path: '/v2/swagger.json',
		dest: dest,
		replacePathsStr: '/v2/{baseSiteId}',
		createErrorFile: true,
		createEmptyFile: true,
		overwriteExistingDescriptions: true,
		responseFuncPath: __dirname + '/func-imported'
	}
});
```

## CLI
- usage `node <script> [--version] [--help] <command> [<args>]`
- usage with demo `node demo/index.js [--version] [--help] <command> [<args>]`
- node-mock-server commands:
-- start mock server `node <script>`
-- print help `node <script> --help`
-- print node-mock-server version `node <script> --version`
-- run a swagger import `node <script> swagger-import`
-- run a validation for all mock data `node <script> validate`
-- lists all available collections `node <script> collections`
-- activate collection `node <script> collection <id>`

## Demo
```shell
git clone https://github.com/smollweide/node-mock-server.git
cd node-mock-server
npm install
node demo
```

## License
[MIT License](https://github.com/smollweide/node-mock-server/blob/master/LICENSE)

## Changelog
Please see the [Releases](https://github.com/smollweide/node-mock-server/releases)
