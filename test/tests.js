var mockServer = require('../mock-server.js'),
	SwaggerImport = require('../lib/SwaggerImport'),
	ValidatorResponses = require('../lib/ValidatorResponses'),
	Utils = require('../lib/Utils'),
	utils = new Utils(),
	serverOptions;

process.env.NODE_ENV = 'test';

utils.writeDir('./test/tmp');

serverOptions = {
	urlBase: 'http://localhost:8888',
	urlPath: '/rest/v1',
	dirName: __dirname,
	port: 8888,
	restPath: __dirname + '/../demo/rest',
	funcPath: [
		__dirname + '/../demo/func',
		__dirname + '/../demo/func2'
	],
	headers: {
		'Global-Custom-Header': 'Global-Custom-Header'
	},
	customDTOToClassTemplate: __dirname + '/data/class-templates/dto_es6flow.ejs',
	middleware: {
		'/../demo/rest/products/#{productCode}/GET'(serverOptions, requestOptions) {

			var productCode = requestOptions.req.params[0].split('/')[3];

			if (productCode === '1234') {
				requestOptions.res.statusCode = 201;
				requestOptions.res.end('product 1234');
				return null;
			}

			requestOptions.res.end('middware response');
			return null;
		}
	},
	swaggerImport: {
		protocol: 'http',
		dirName: __dirname,
		authUser: undefined,
		authPass: undefined,
		host: 'localhost',
		port: 8888,
		path: '/src/swagger/swagger-api-docs.json',
		dest: __dirname + '/../test/tmp/swagger-import',
		replacePathsStr: '/v2/{id}',
		createErrorFile: true,
		createEmptyFile: true,
		overwriteExistingDescriptions: true,
		isTest: true,
		responseFuncPath: __dirname + '/tmp/func-imported'
	}
};

function _startMockServer () {
	mockServer(serverOptions);
}

function _getFile(path) {
	return utils.readFile(path);
}

_startMockServer();

var swaggerImporter = new SwaggerImport(serverOptions.swaggerImport);

new ValidatorResponses({
	restPath: serverOptions.restPath
}, serverOptions);

swaggerImporter.doImport(function () {

	describe('MockServer', require('./tests-mock-server').bind(this, serverOptions, _getFile));
	describe('UserInterface', require('./tests-userinterface').bind(this, serverOptions, _getFile));
	describe('Preferences', require('./tests-preferences').bind(this, serverOptions, _getFile));
	describe('SwaggerImport', require('./tests-swagger-import').bind(this, serverOptions, _getFile));
	describe('GetResponse', require('./tests-get-response').bind(this, serverOptions, _getFile));
	describe('ValidatorResponses', require('./tests-validator-responses').bind(this, serverOptions, _getFile));
	describe('DTOImport', require('./tests-dto-import').bind(this, serverOptions, _getFile));
	describe('DTOToClassConverter', require('./tests-dto-2-class').bind(this, serverOptions, _getFile));
	describe('DTOToResponseFuncConverter', require('./tests-dto-response-func').bind(this, serverOptions, _getFile));

});
