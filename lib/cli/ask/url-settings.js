var inquirer = require('inquirer');
var Promise = require('es6-promise-polyfill').Promise;

function askForUrlSettings() {
	return new Promise((resolve) => {
		inquirer.prompt([
			{
				type: 'input',
				name: 'urlBase',
				message: 'Enter the url under which the server should be accessible (just protocol, host and port)',
				default: 'http://localhost:3001',
			},
			{
				type: 'input',
				name: 'urlPath',
				message: 'Enter the url path under which the server should be accessible',
				default: '/rest/v1',
			},
			{
				type: 'input',
				name: 'port',
				message: 'Enter the url port which the server should be accessible',
				default: '3001',
			},
			{
				type: 'input',
				name: 'uiPath',
				message: 'Enter the url path under which the UI should be accessible',
				default: '/',
			},
		]).then(resolve);
	});
}

module.exports = askForUrlSettings;
