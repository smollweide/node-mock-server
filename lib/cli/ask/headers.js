var inquirer = require('inquirer');
var jQueryExtend = require('extend');
var Promise = require('es6-promise-polyfill').Promise;
var defaultOptions = require('../../defaults/options-defaults');

function askForHeader(headerCallback) {
	inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: 'Enter response header key',
		},
		{
			type: 'input',
			name: 'value',
			message: 'Enter response header value',
		},
	]).then(function (headerAnswer) {
		var headers = {};
		headers[headerAnswer.name] = headerAnswer.value;
		headerCallback(headers);
	});
}
function askForAddHeader(headers, headerCallback) {
	inquirer.prompt([
		{
			type: 'list',
			name: 'addHeader',
			choices: ['Yes', 'No'],
			message: 'Do you want to add another response header?',
			default: 'Yes',
		},
	]).then(function (answers) {
		if (answers.addHeader.toUpperCase() === 'YES') {
			askForHeader(function (headerResult) {
				headers = jQueryExtend(true, headers, headerResult);
				askForAddHeader(headers, headerCallback);
			});
			return;
		}
		headerCallback({ headers: headers });
	});
}

function askForHeaders() {
	return new Promise((resolve) => {
		inquirer.prompt([
			{
				type: 'list',
				choices: ['Yes', 'No'],
				name: 'useDefaultHeaders',
				message: 'Do you want to use the default response headers?',
				default: 'Yes',
			},
		]).then(function (answers) {
			if (answers.useDefaultHeaders.toUpperCase() === 'YES') {
				resolve({
					contentType: defaultOptions.contentType,
					accessControlExposeHeaders: defaultOptions.accessControlExposeHeaders,
					accessControlAllowOrigin: defaultOptions.accessControlAllowOrigin,
					accessControlAllowMethods: defaultOptions.accessControlAllowMethods,
					accessControlAllowHeaders: defaultOptions.accessControlAllowHeaders,
				});
				return;
			}
			inquirer.prompt([
				{
					type: 'input',
					name: 'contentType',
					message: 'Enter "Content-Type" response header',
					default: 'application/json',
				},
				{
					type: 'input',
					name: 'accessControlExposeHeaders',
					message: 'Enter "Access-Control-Expose-Headers" response header',
					default: 'X-Total-Count',
				},
				{
					type: 'input',
					name: 'accessControlAllowOrigin',
					message: 'Enter "Access-Control-Allow-Origin" response header',
					default: '*',
				},
				{
					type: 'input',
					name: 'accessControlAllowMethods',
					message: 'Enter "Access-Control-Allow-Methods" response header',
					default: 'GET, POST, PUT, OPTIONS, DELETE, PATCH, HEAD',
				},
				{
					type: 'input',
					name: 'accessControlAllowHeaders',
					message: 'Enter "Access-Control-Allow-Headers" response header',
					default: 'origin, x-requested-with, content-type',
				},
			]).then(function (answersOtherHeaders) {
				askForAddHeader({}, function (answerHeaders) {
					resolve(jQueryExtend(true, answerHeaders, answersOtherHeaders));
				});
			});
		});
	});
}

module.exports = askForHeaders;
