var inquirer = require('inquirer');
var jQueryExtend = require('extend');
var Promise = require('es6-promise-polyfill').Promise;

function askForTunnelRequestHeader(headerCallback) {
	inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: 'Enter request header key',
		},
		{
			type: 'input',
			name: 'value',
			message: 'Enter request header value',
		},
	]).then(function (headerAnswer) {
		var headers = {};
		headers[headerAnswer.name] = headerAnswer.value;
		headerCallback(headers);
	});
}
function askForTunnelRequestAddHeader(headers, headerCallback) {
	inquirer.prompt([
		{
			type: 'list',
			name: 'addTunnelRequestHeader',
			choices: ['Yes', 'No'],
			message: 'Do you want to add a tunnel request header?',
			default: 'Yes',
		},
	]).then(function (answers) {
		if (answers.addTunnelRequestHeader.toUpperCase() === 'YES') {
			askForTunnelRequestHeader(function (headerResult) {
				headers = jQueryExtend(true, headers, headerResult);
				askForTunnelRequestAddHeader(headers, headerCallback);
			});
			return;
		}
		headerCallback({ headers: headers });
	});
}
function askForTunnel() {
	return new Promise((resolve) => {
		inquirer.prompt([
			{
				type: 'list',
				name: 'useTunnel',
				choices: ['Yes', 'No'],
				message: 'Want to use a tunnel?',
				default: 'Yes',
			},
		]).then(function (answers) {
			if (answers.useTunnel.toUpperCase() === 'NO') {
				resolve({});
				return;
			}

			inquirer.prompt([
				{
					type: 'input',
					name: 'protocol',
					message: 'Enter the tunnel url protocol',
					default: 'http',
				},
				{
					type: 'input',
					name: 'authUser',
					message: 'Enter the tunnel url basic auth user name',
				},
				{
					type: 'input',
					name: 'authPass',
					message: 'Enter the tunnel url basic auth password',
				},
				{
					type: 'input',
					name: 'host',
					message: 'Enter the tunnel url host',
					default: 'localhost',
				},
				{
					type: 'input',
					name: 'port',
					message: 'Enter the tunnel url port',
					default: '80',
				},
			]).then(function (answersOptions) {
				var options = { tunnel: answersOptions };
				options.tunnel.headers = {};
				askForTunnelRequestAddHeader({}, function (answerHeaders) {
					options.tunnel.headers = answerHeaders.headers;
					if (options.tunnel.authUser === '') {
						delete options.tunnel.authUser;
					}
					if (options.tunnel.authPass === '') {
						delete options.tunnel.authPass;
					}
					resolve(options);
				});
			});
		});
	});
}

module.exports = askForTunnel;
