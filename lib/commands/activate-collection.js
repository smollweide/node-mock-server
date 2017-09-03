'use strict';

var log = require('chip')();
var Utils = require('../Utils');
var utils = new Utils();
var getCollection = require('./get-collection');
var ignoreInRestRoot = require('../constants/ignore-in-rest-root');

function activateCollection(id, options) {

	if (!utils.isFilledString(id)) {
		return false;
	}

	var collection;

	if (id === 'reset' || id === 'tunnel' || id === 'tunnel-latest') {
		collection = {
			selectedResponses: {},
		};
	} else {
		collection = getCollection(id, options);
	}

	if (!collection || !collection.selectedResponses) {
		return true;
	}

	var selectedResponses = collection.selectedResponses;

	var path = `${options.restPath}`;
	var serviceGroups = utils.readDir(path, ignoreInRestRoot);

	serviceGroups.forEach(function (serviceGroup) {
		var endPoints = utils.readDir(serviceGroup.path);
		endPoints.forEach(function (endPoint) {
			var services = utils.readDir(endPoint.path);
			services.forEach(function (service) {
				var name = `${serviceGroup.file}/${endPoint.file}/${service.file}`;
				var pathSelectedFile = `${service.path}/mock/response.txt`;

				if (id === 'tunnel') {
					// if tunnel save tunnel as selected response
					utils.writeFile(pathSelectedFile, 'tunnel');
					log(`Wrote file "${pathSelectedFile.replace(options.restPath, '')}"`);
				} else if (id === 'tunnel-latest') {
					// if tunnel-latest save tunnel-latest.json as selected response
					utils.writeFile(pathSelectedFile, 'tunnel-latest');
					log(`Wrote file "${pathSelectedFile.replace(options.restPath, '')}"`);
				} else if (typeof selectedResponses[name] === 'string') {
					// if nothing is selected remove file -> fallback success
					utils.writeFile(pathSelectedFile, selectedResponses[name]);
					log(`Wrote file "${pathSelectedFile.replace(options.restPath, '')}"`);
				} else if (utils.existFile(pathSelectedFile)) {
					utils.removeFile(pathSelectedFile);
					log(`Removed file "${pathSelectedFile.replace(options.restPath, '')}"`);
				}
			});
		});
	});

	return true;
}

module.exports = activateCollection;
