var inquirer = require('inquirer');
var Promise = require('es6-promise-polyfill').Promise;

function askForDefaultConfig() {
	return new Promise((resolve, reject) => {
		inquirer.prompt([
			{
				type: 'list',
				name: 'defaultConfig',
				choices: ['Yes', 'No'],
				message: 'Do you want to use the default configuration?',
				default: 'Yes',
			},
		]).then(function (answers) {
			if (answers.defaultConfig.toUpperCase() === 'YES') {
				reject();
				return;
			}
			resolve({});
		});
	});
}

module.exports = askForDefaultConfig;
