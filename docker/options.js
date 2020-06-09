"use strict";
var convict = require("convict");
var dest = __dirname + "../demo/rest";
var replacePathsStr = "/v2/{baseSiteId}";
var responseFuncPath = __dirname + "/func-imported";

// http://petstore.swagger.io/v2/swagger.json
// http://localhost:3001/src/swagger/swagger-demo-docs.json

const config = convict({
	restPath: {
		doc: "A string value that defines the path to the rest API folder.",
		format: "String",
		default: __dirname + "/../demo/rest",
		env: "REST_PATH",
	},
	dirName: {
		doc: "A string value that defines the root directory.",
		format: "String",
		default: __dirname + + "/../demo",
		env: "DIR_NAME",
	},
	uiPath: {
		doc:
			"A string value that defines the path for the node-mock-server UI.",
		format: "String",
		default: "/",
		env: "UI_PATH",
	},
	urlPath: {
		doc: "A string value that defines the path for the mock Rest API.",
		format: "String",
		default: "/rest/v1",
		env: "URL_PATH",
	},
	customDTOToClassTemplate: {
		doc: "A string that define the path to the custom DTO to class template.",
		format: "String",
		default: __dirname + "/../demo/templates/dto_es6flow.ejs",
		env: "CUSTOM_DTO_TO_CLASS_TEMPLATE",
	},
	optionsFallbackPath: {
		doc: "A string that defines and enables the options fallback.",
		format: "String",
		default: __dirname + "/../demo/rest/_fallbacks/#/OPTIONS/",
		env: "OPTIONS_FALLBACK_PATH"
	},
	open: {
		doc: "A boolean to decide to open the UI after start or not.",
		format: "Boolean",
		default: true,
		env: "OPEN"
	},
});

module.exports = {
	...config.getProperties(),
	funcPath: [
		__dirname + '/func',
		__dirname + '/func2',
		responseFuncPath,
	],
	headers: {
		"Global-Custom-Header": "Global-Custom-Header",
	},
	middleware: {
		"/rest/products/#{productCode}/GET"(serverOptions, requestOptions) {
			var productCode = requestOptions.req.params[0].split("/")[3];

			if (productCode === "1234") {
				requestOptions.res.statusCode = 201;
				requestOptions.res.end("product 1234");
				return null;
			}

			return "success";
		},
	},
	expressMiddleware: [
		function (express) {
			return ["/public", express.static(__dirname + "/public")];
		},
	],
	swaggerImport: {
		protocol: "http",
		authUser: undefined,
		authPass: undefined,
		host: "petstore.swagger.io",
		port: 80,
		path: "/v2/swagger.json",
		dest: dest,
		replacePathsStr: replacePathsStr,
		createErrorFile: true,
		createEmptyFile: true,
		overwriteExistingDescriptions: true,
		responseFuncPath: responseFuncPath,
	},
	tunnel: {
		protocol: "http",
		authUser: undefined,
		authPass: undefined,
		host: "localhost",
		port: 3333,
		requestHeaders: {
			host: "www.test.com",
			referer: "http://www.test.com/",
		},
	},
};
