/* eslint no-console: 0 */
var inquirer = require('inquirer');
var Promise = require('es6-promise-polyfill').Promise;

function askForSwaggerImport() {
	return new Promise((resolve) => {
		inquirer.prompt([
			{
				type: 'list',
				choices: ['Yes', 'No'],
				name: 'useSwaggerImport',
				message: 'Do you want to use the swagger import?',
				default: 'No',
			},
		]).then(function (answers) {
			if (answers.useSwaggerImport.toUpperCase() === 'NO') {
				resolve({});
				return;
			}
			console.log('');
			console.log('/**');
			console.log(' *  To import schemas from swagger you need to provide the url to the swagger api json file.');
			console.log(' *  In case of you want to import the schemas from "http://petstore.swagger.io/".');
			console.log(' *  You need to provide this url: http://petstore.swagger.io/v2/swagger.json');
			console.log('**/');
			console.log('');
			inquirer.prompt([
				{
					type: 'input',
					name: 'protocol',
					message: 'Enter the swagger url protocol',
					default: 'http',
				},
				{
					type: 'input',
					name: 'authUser',
					message: 'Enter the swagger url basic auth user name',
				},
				{
					type: 'input',
					name: 'authPass',
					message: 'Enter the swagger url basic auth password',
				},
				{
					type: 'input',
					name: 'host',
					message: 'Enter the swagger url host',
					default: 'petstore.swagger.io',
				},
				{
					type: 'input',
					name: 'port',
					message: 'Enter the swagger url port',
					default: '80',
				},
				{
					type: 'input',
					name: 'path',
					message: 'Enter the swagger url path',
					default: '/v2/swagger.json',
				},
				{
					type: 'input',
					name: 'replacePathsStr',
					message: 'Enter the part of the endpoints which should be removed (if needed)',
				},
				{
					type: 'confirm',
					name: 'createErrorFile',
					message: 'Write error response files while importing?',
					default: true,
				},
				{
					type: 'confirm',
					name: 'createEmptyFile',
					message: 'Write empty response files while importing?',
					default: true,
				},
				{
					type: 'confirm',
					name: 'overwriteExistingDescriptions',
					message: 'Overwrite existing descriptions?',
					default: true,
				},
				{
					type: 'input',
					name: 'responseFuncPath',
					message: 'Enter the desired path (from the mock server directory) to store the imported mock functions',
					default: 'func-imported',
				},
				{
					type: 'input',
					name: 'customDTOToClassTemplate',
					message: 'Enter the path to a custom "DTO to class" template',
				},
			]).then(function (answersSwaggerImport) {
				if (answersSwaggerImport.authUser === '') {
					delete answersSwaggerImport.authUser;
				}
				if (answersSwaggerImport.authPass === '') {
					delete answersSwaggerImport.authPass;
				}
				if (answersSwaggerImport.customDTOToClassTemplate === '') {
					delete answersSwaggerImport.customDTOToClassTemplate;
				}
				resolve({
					swaggerImport: answersSwaggerImport,
				});
			});
		});
	});
}

module.exports = askForSwaggerImport;
