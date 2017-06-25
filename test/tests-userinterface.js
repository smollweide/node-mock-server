
var assert = require('assert'),
	MockController = require('../lib/controller/MockController.js'),
	UserInterface = require('../lib/UserInterface');


module.exports = function(serverOptions, _getFile) {

	it('method _readApiMethods', function () {

		var userInterface = new UserInterface(serverOptions);

		var methods = userInterface._readApiMethods(serverOptions.restPath + '/products/#');

		assert.equal(methods.length, 1);
		var methodDesc = methods[0];

		assert.equal(methodDesc.name, 'GET');

		assert.equal(methodDesc.availableMockResponses.length, 3);
		var availableMockResponses = methodDesc.availableMockResponses;

		var errorResponse = availableMockResponses[0];
		assert.equal(errorResponse.name, "error");
		assert.equal(errorResponse.file, "error.json");

		var successResponse = availableMockResponses[1];
		assert.equal(successResponse.name, "success");
		assert.equal(successResponse.file, "success.json");

		var middlewareResponse = availableMockResponses[2];
		assert.equal(middlewareResponse.name, "middleware");
		assert.equal(middlewareResponse.file, "middleware");
	});
}