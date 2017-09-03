var inquirer = require('inquirer');
var Promise = require('es6-promise-polyfill').Promise;

function askForNaming() {
	return new Promise((resolve) => {
		inquirer.prompt([
			{
				type: 'input',
				name: 'title',
				message: 'Enter the title of the API',
				default: 'Api mock server',
			},
			{
				type: 'input',
				name: 'version',
				message: 'Enter the version number of the API',
				default: '1',
			},
		]).then(resolve);
	});
}

module.exports = askForNaming;
