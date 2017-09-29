
var assert = require('assert'),
	GetResponse = require('../lib/GetResponse');

module.exports = function(serverOptions, _getFile) {

	var pathExpGetResponse = './test/expected/get-response';

	// GET call
	it('response from GET /product/{productCode}', function() {
		var response,
			data,
			expected;

		response = new GetResponse({
			path: serverOptions.restPath + '/products/{productCode}',
			method: 'get',
			expected: 'success-default'
		}, serverOptions);
		expected = _getFile(pathExpGetResponse + '/01.json');
		data = response.get();
		assert.equal(JSON.stringify(data), expected);
	});

	// POST call
	it('response from POST /product/{productCode}', function() {
		var response,
			data,
			expected;

		response = new GetResponse({
			path: serverOptions.restPath + '/products/{productCode}',
			method: 'post',
			expected: 'success'
		}, serverOptions);
		expected = JSON.parse(_getFile(pathExpGetResponse + '/02.json'));
		data = response.get();
		assert.equal(data.success, expected.success);
		assert.equal(data.body, expected.body);
		assert.equal(data.query, expected.query);
		assert.equal(data.param, expected.param);
		assert.equal(typeof data.faker, typeof expected.faker);
		assert.equal(typeof data.price, typeof expected.price);
	});

	// FAKER call
	it('response from GET /product/{productCode} - with faker', function() {
		var response,
			data;

		response = new GetResponse({
			path: serverOptions.restPath + '/products/{productCode}',
			method: 'get',
			expected: 'faker'
		}, serverOptions);
		data = response.get();

		assert.equal(typeof data.price, 'object');
		assert.equal(data.cards instanceof Array, true);
		assert.equal(typeof data.email, 'string');
	});

	// FUNCTIONS call
	it('response from GET /product/{productCode} - with functions', function() {
		var response,
			data;

		response = new GetResponse({
			path: serverOptions.restPath + '/products/{productCode}',
			method: 'get',
			expected: 'func'
		}, serverOptions);
		data = response.get();

		assert.equal(typeof data.image, 'object');
		assert.equal(typeof data.image.url, 'string');
		assert.equal(typeof data.image.alt, 'string');
	});

	// REQUEST DATA call
	it('response from GET /product/{productCode} - with request data', function() {
		var response,
			data;

		response = new GetResponse({
			path: serverOptions.restPath + '/products/{productCode}',
			method: 'get',
			expected: 'request-data',
			queryParams: {
				currentPage: 3
			}
		}, serverOptions);
		data = response.get();

		assert.equal(data.currentPage, 3);
	});

	// REQUEST DATA call
	it('response from GET /product/{productCode} - with request data from path', function() {
		var response,
			data;

		response = new GetResponse({
			path: serverOptions.restPath + '/products/test',
			method: 'get',
			expected: 'request-data',
			queryParams: {
				currentPage: 12
			}
		}, serverOptions);
		data = response.get();

		assert.equal(data.productCode, 'test');
	});

};
