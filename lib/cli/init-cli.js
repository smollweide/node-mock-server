/* eslint no-console: 0 */
var path = require('path');
var log = require('chip')();
var jQueryExtend = require('extend');
var makeDir = require('make-dir');
var pSeries = require('p-series');
var Utils = require('../Utils');
var defaultOptions = require('../defaults/options-defaults');

var utils = new Utils();

var askForTunnel = require('./ask/tunnel');
var askForNaming = require('./ask/naming');
var askForHeaders = require('./ask/headers');
var askForSsl = require('./ask/ssl');
var askForUrlSettings = require('./ask/url-settings');
var askForPath = require('./ask/path');
var askForDefaultConfig = require('./ask/default-config');
var askForFuncPath = require('./ask/func-path');
var askForSwaggerImport = require('./ask/swagger-import');

function writeDirectory(answers) {
	var _path = path.join(answers.path);
	var _pathData = path.join(_path, '/rest');
	makeDir.sync(_path);
	makeDir.sync(_pathData);
	log('Wrote directroy "' + _path + '"');
	log('Wrore directroy "' + _pathData + '"');
	return Boolean(utils.existDir(_path) && utils.existDir(_pathData)) ? _path : undefined;
}

function getConfigFromResult(result) {
	var config = {};
	if (result instanceof Array) {
		utils.for(result, function (value) {
			config = jQueryExtend(true, config, value);
		});
	} else if (typeof result === 'object') {
		config = result;
	}
	return config;
}

function getCleanConfigString(_path, config) {
	config.restPath = '/rest';
	if (typeof config.swaggerImport === 'object') {
		config.swaggerImport.dest = config.restPath;
	}
	config.dirName = '<noQuote>__dirname</noQuote>';
	if (config.funcPath) {
		config.funcPath = '<noQuote>path.join(__dirname, \'' + config.funcPath + '\')</noQuote>';
	}
	if (config.restPath) {
		config.restPath = '<noQuote>path.join(__dirname, \'' + config.restPath + '\')</noQuote>';
	}
	if (config.swaggerImport && config.swaggerImport.responseFuncPath) {
		config.swaggerImport.responseFuncPath = '<noQuote>path.join(__dirname, \'' +
			config.swaggerImport.responseFuncPath + '\')</noQuote>';
	}
	if (config.swaggerImport && config.swaggerImport.dest) {
		config.swaggerImport.dest = '<noQuote>path.join(__dirname, \'' +
			config.swaggerImport.dest + '\')</noQuote>';
	}
	return JSON.stringify(config, null, 4)
		.replace(/"<noQuote>/g, '')
		.replace(/<\/noQuote>"/g, '')
		.replace(/"/g, '\'')
		.replace(/ {4}/g, '\t')
	;
}

function logStart() {
	console.log('');
	console.log(' |                                    |');
	console.log(' |        node-mock-server init       |');
	console.log(' |                                    |');
	console.log('');
}

function logEnd(_path, result) {
	log('Wrote file "' + _path + '/index.js"');
	console.log('');
	if (result.swaggerImport) {
		console.log('Run `node ' + _path + ' swagger-import` for importing schemas!');
	}
	if (result.tunnel) {
		console.log('Run `node ' + _path + ' collections tunnel` for activate the tunnel everwhere!');
	}
	console.log('Run `node ' + _path + '` for starting the server!');
}

function writeGitIgnore(_path) {
	var fileData = '';
	var gitIgnorePath = '.gitignore';
	if (utils.existFile(gitIgnorePath)) {
		fileData = utils.readFile(gitIgnorePath);
	}
	utils.writeFile(gitIgnorePath, fileData + '\n' + _path + '/rest/*/*/*/mock/response.txt');
	log('.gitignore was updated');
}

function initCli() {
	logStart();
	askForPath().then(function (answers) {
		var _path = writeDirectory(answers);
		if (!_path) {
			return;
		}

		writeGitIgnore(_path);

		askForDefaultConfig()
			.then(function () {
				pSeries([
					askForNaming,
					askForHeaders,
					askForSsl,
					askForUrlSettings,
					askForFuncPath,
					askForSwaggerImport,
					askForTunnel,
				]).then(result => {
					var config = getConfigFromResult(result);
					var fileData = [
						'',
						'var mockServer = require(\'node-mock-server\');',
						'var path = require(\'path\');',
						'',
						'mockServer(' + getCleanConfigString(_path, config) + ');',
						'',
					].join('\n');
					utils.writeFile(_path + '/index.js', fileData);
					logEnd(_path, config);
				});
			})
			.catch(function () {
				var fileData = [
					'',
					'var mockServer = require(\'node-mock-server\');',
					'var path = require(\'path\');',
					'',
					'mockServer(' + getCleanConfigString(_path, defaultOptions) + ');',
					'',
				].join('\n');
				utils.writeFile(_path + '/index.js', fileData);
				logEnd(_path, {});
			})
		;
	});
}

module.exports = initCli;
