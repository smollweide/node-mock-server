var inquirer = require('inquirer');
var Promise = require('es6-promise-polyfill').Promise;

function askForSSL() {
	return new Promise((resolve) => {
		inquirer.prompt([
			{
				type: 'list',
				name: 'ssl',
				choices: ['Yes', 'No'],
				message: 'Want to use SSL?',
				default: 'Yes',
			},
		]).then(function (answers) {
			if (answers.ssl.toUpperCase() === 'NO') {
				resolve({});
				return;
			}

			inquirer.prompt([
				{
					type: 'input',
					name: 'privateKey',
					message: 'Enter the desired path (from the mock server directory) to the "private key" file',
				},
				{
					type: 'input',
					name: 'certificate',
					message: 'Enter the desired path (from the mock server directory) to the "certificate" file',
				},
			]).then(resolve);
		});
	});
}

module.exports = askForSSL;
