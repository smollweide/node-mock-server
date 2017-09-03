var inquirer = require('inquirer');
var Promise = require('es6-promise-polyfill').Promise;

function askForPath() {
	return new Promise((resolve) => {
		inquirer.prompt([
			{
				type: 'input',
				name: 'path',
				message: 'Enter the desired path (from your current directory) to store the mock server data',
				default: 'mock',
			},
		]).then(function (answers) {
			resolve(answers);
		});
	});
}

module.exports = askForPath;
