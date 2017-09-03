
'use strict';

var dest = __dirname + '/rest';
var replacePathsStr = '/v2/{baseSiteId}';
var responseFuncPath = __dirname + '/func-imported';

// http://petstore.swagger.io/v2/swagger.json
// http://localhost:3001/src/swagger/swagger-demo-docs.json

module.exports = {
	restPath: dest,
	dirName: __dirname,
	uiPath: '/',
	funcPath: [
		__dirname + '/func',
		__dirname + '/func2',
		responseFuncPath,
	],
	headers: {
		'Global-Custom-Header': 'Global-Custom-Header',
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
		dest: dest,
		replacePathsStr: replacePathsStr,
		createErrorFile: true,
		createEmptyFile: true,
		overwriteExistingDescriptions: true,
		responseFuncPath: responseFuncPath,
	},
	open: false,
	tunnel: {
		protocol: 'http',
		authUser: undefined,
		authPass: undefined,
		host: 'localhost',
		port: 3333,
		requestHeaders: {
			host: 'www.test.com',
			referer: "http://www.test.com/",
		},
	}
}
