var inquirer = require('inquirer');
var Promise = require('es6-promise-polyfill').Promise;

function askForFuncPath() {
	return new Promise((resolve) => {
		inquirer.prompt([
			{
				type: 'input',
				name: 'funcPath',
				message: 'Enter the desired path (from the mock server directory) to store the mock functions',
				default: '/func',
			},
		]).then(resolve);
	});
}

module.exports = askForFuncPath;
