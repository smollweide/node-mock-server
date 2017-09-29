
'use strict';

var mime = require('mime-types');
var Utils = require('./Utils.js');
var extend = require('util')._extend;
var ignoreInRestRoot = require('./constants/ignore-in-rest-root');

/**
 * @constructor UserInterface
 * @namespace UserInterface
 * @param {Object} options - the node-mock-server options
 */
function UserInterface(options) {
	this.init(options);
}

UserInterface.prototype = extend(UserInterface.prototype, Utils.prototype);
UserInterface.prototype = extend(UserInterface.prototype, {
	constructor: UserInterface,

	/**
	 * called by constructor
	 * @param {Object} options - the node-mock-server options
	 * @returns {void}
	 */
	init: function (options) {

		this.options = options;
		this._data = [];
		this._dataDto = [];
		this._dataCollections = [];
		this._swaggerImport = this._readSwaggerImportFile();
		this._validation = this._readValidationFile();
		this._isSwaggerImportAvailable = (typeof options.swaggerImport === 'object');
		this._isCustomDTOToClassAvailable = (typeof options.customDTOToClassTemplate === 'string');

		this._readApi();
		this._readDtos();
		this._readCollections();
	},

	/**
	 * @param {string} type - the getter type
	 * @returns {void}
	 */
	get: function (type) {

		switch (type) {
			case 'data': return this._data;
			case 'dataDto': return this._dataDto;
			case 'dataCollections': return this._dataCollections;
			case 'swaggerImport': return this._swaggerImport;
			case 'validation': return this._validation;
			case 'isSwaggerImportAvailable': return this._isSwaggerImportAvailable;
			case 'isCustomDTOToClassAvailable': return this._isCustomDTOToClassAvailable;
			default: return this._data;
		}

	},

	/**
	 * @param {string} value - the given string, should be unique
	 * @returns {string} - the cleaned id
	 * @private
	 */
	_toId: function (value) {
		return value.replace(/[-_,.#/{}]/g, '');
	},

	/**
	 * @method _readDtos
	 * @returns {void}
	 * @private
	 */
	_readDtos: function () {

		var path = this.options.restPath + '/_DTO';
		var files = this.readDir(path, ['.DS_Store']);

		this.for(files, function (item) {
			this._dataDto.push(this._readDto(path, item.file));
		}.bind(this));
	},

	/**
	 * @method _readCollections
	 * @returns {void}
	 * @private
	 */
	_readCollections: function () {

		var path = this.options.restPath + '/_collections';
		var files = this.readDir(path, ['.DS_Store']);

		this._dataCollections.push({
			name: 'Reset',
			id: 'reset',
			description: 'will remove all "response.txt" files.',
			isDeleteable: false,
			isOpenable: false,
		});

		this._dataCollections.push({
			name: 'Tunnels',
			id: 'tunnel',
			description: 'will activate the tunnel everwhere',
			isDeleteable: false,
			isOpenable: false,
		});

		this._dataCollections.push({
			name: 'Tunnel latest',
			id: 'tunnel-latest',
			description: 'will activate all latest tunnel responses',
			isDeleteable: false,
			isOpenable: false,
		});

		this.for(files, function (item) {
			this._dataCollections.push(this._readCollection(path, item.file));
		}.bind(this));
	},

	/**
	 * @param {string} path - the dto directory
	 * @param {string} fileName - the collection fileName
	 * @returns {Object} the collection response
	 * @private
	 */
	_readCollection: function (path, fileName) {
		var collectionData = JSON.parse(this.readFile(path + '/' + fileName));
		collectionData.id = fileName.replace(/\.json$/, '');
		collectionData.path = path + '/' + fileName;
		return collectionData;
	},

	/**
	 * @param {string} path - the dto directory
	 * @param {string} fileName - the dto fileName
	 * @returns {Object} the dto response
	 * @private
	 */
	_readDto: function (path, fileName) {

		var schemaFileObj;
		var schemaObj = {
			isRequest: false,
			path: path,
			item: fileName,
			isFileRaw: false,
			isDto: true,
		};

		schemaFileObj = extend({}, schemaObj);
		schemaFileObj.isFileRaw = true;

		return {
			name: fileName,
			nameClean: fileName.replace('.json', ''),
			data: JSON.parse(this.readFile(path + '/' + fileName)),
			url: this.options.urlBase,
			path: path + '/' + fileName,
			schemaUrl: this._getSchemaUrl(schemaObj),
			schemaFileUrl: this._getSchemaUrl(schemaFileObj),
		};
	},

	/**
	 * @returns {void}
	 * @private
	 */
	_readApi: function () {

		var files = [];

		try {
			files = this.readDir(this.options.restPath, ignoreInRestRoot);
		} catch (err) {
			files = [];
		}

		this.for(files, function (item) {
			this._data.push(this._readApiGroup(item.file));
		}.bind(this));
	},

	/**
	 * @returns {Object} swaggerImport
	 * @private
	 */
	_readSwaggerImportFile: function () {

		var data = undefined;

		try {
			data = this.readFile(this.options.restPath + '/.swagger_import.json');
			data = JSON.parse(data.toString());
		} catch (err) {
			return {};
		}

		if (data && data.dateTime) {
			return data;
		}

		return {};
	},

	/**
	 * @method _readValidationFile
	 * @returns {Object} swaggerImport
	 * @private
	 */
	_readValidationFile: function () {

		var data = undefined;

		try {
			data = this.readFile(this.options.restPath + '/.validation.json');
			data = JSON.parse(data.toString());
		} catch (err) {
			return {};
		}

		if (data && data.messages) {

			var type = 'warning';
			var errorCounter = 0;
			var successCounter = 0;
			var infoCounter = 0;
			var warnCounter = 0;

			data.messages.forEach(function (msg) {
				switch (msg.type) {
					case 'success':
						successCounter += 1;
						break;
					case 'info':
						infoCounter += 1;
						break;
					case 'error':
						errorCounter += 1;
						break;
					default:
						warnCounter += 1;
				}
			});

			if (errorCounter > 0) {
				type = 'danger';
			} else if (warnCounter > 0) {
				type = 'warning';
			} else if (successCounter > 0) {
				type = 'success';
			}

			return {
				dateTime: data.dateTime,
				messages: data.messages,
				messagesStr: JSON.stringify(data.messages).replace(/"/g, '\\"'),
				type: type,
				counter: {
					error: errorCounter,
					success: successCounter,
					info: infoCounter,
					warn: warnCounter,
				},
			};
		}

		return {};
	},

	/**
	 * @param {string} item - one raw item
	 * @returns {Object} one api entry object
	 * @private
	 */
	_readApiGroup: function (item) {
		return {
			name: item,
			id: this._toId(item),
			path: this.options.restPath,
			services: this._readApiService(item),
			preferences: this.getPreferences(this.options),
		};
	},

	/**
	 * @param {string} groupItem - name of the service
	 * @returns {Array} list of services
	 * @private
	 */
	_readApiService: function (groupItem) {

		var path = this.options.restPath + '/' + groupItem;
		var files = [];
		var data = [];

		try {
			files = this.readDir(path, ['.DS_Store']);
		} catch (err) {
			return [];
		}

		this.for(files, function (item) {
			var itemPath = path + '/' + item.file;
			var name = groupItem;

			if (item.file !== '#') {
				name += '/' + item.file.replace(/#/g, '/').substr(1, 9999);
			}

			data.push({
				name: name,
				path: itemPath,
				id: this._toId(name),
				methods: this._readApiMethods(itemPath),
			});
		}.bind(this));

		return data;
	},

	/**
	 * @param {Object} options - the node-mock-server options object
	 * @returns {string} returns the view schema service url
	 * @private
	 */
	_getSchemaUrl: function (options) {

		var urlSpl = [];
		var itemPath = options.path + '/' + options.item;
		var paramUrl;
		var paramType;
		var urlPath;
		var cleanPath = options.path.replace(this.options.restPath, '').replace(/#/g, '/').replace(/\/\//g, '/');

		if (options.isFileRaw) {
			urlPath = '/view/schema/file';
		} else {
			urlPath = '/view/schema';
		}

		if (options.isRequest) {
			paramType = '&type=Request';
			paramUrl = '?url=' + encodeURIComponent(itemPath + '/request_schema.json');
		} else if (options.isDto) {
			paramType = '&type=DTO';
			paramUrl = '?url=' + encodeURIComponent(itemPath);
		} else {
			paramType = '&type=Response';
			paramUrl = '?url=' + encodeURIComponent(itemPath + '/response_schema.json');
		}

		if (options.isFileRaw) {
			urlSpl.push(this.options.urlBase);
			urlSpl.push(urlPath);
			urlSpl.push(paramUrl);

			return urlSpl.join('');
		}

		urlSpl.push(this.options.urlBase);
		urlSpl.push(urlPath);
		urlSpl.push(paramUrl);
		urlSpl.push(paramType);
		if (!options.isDto) {
			urlSpl.push('&path=' + encodeURIComponent(cleanPath));
			urlSpl.push('&method=' + options.item);
		}

		return urlSpl.join('');
	},

	/**
	 * @param {string} path - the path to the method which are part of the service list
	 * @returns {Array} list of methods eg. GET, POST ...
	 * @private
	 */
	_readApiMethods: function (path) {

		var files = this.readDir(path, ['.DS_Store']);
		var data = [];

		this.for(files, function (dirItem) {
			var item = dirItem.file;
			var itemPath = path + '/' + item;
			var mockPath = itemPath + '/mock';
			var name = item.replace(/#/g, '/');
			var nameLower = name.toLowerCase();
			var desc = this._readApiDesc(itemPath);
			var statusClass = '';
			var isDeprecated = this._isDeprecated(itemPath);

			switch (desc.status) {
				case 'process':
					statusClass = 'info';
					break;
				case 'approve':
					statusClass = 'primary';
					break;
				case 'approved':
					statusClass = 'success';
					break;
				case 'blocked':
					statusClass = 'danger';
					break;
				default:
					statusClass = 'warning';
					break;
			}

			desc.requestFilePath = itemPath + '/request_schema.json';
			desc.responseFilePath = itemPath + '/response_schema.json';
			desc.descFilePath = itemPath + '/desc.json';

			if (desc.request && desc.request.schema) {
				desc.request.schema.url = this._getSchemaUrl({
					isRequest: true,
					path: path,
					item: item,
					isFileRaw: false,
					isDto: false,
				});
				desc.request.schema.urlFile = this._getSchemaUrl({
					isRequest: true,
					path: path,
					item: item,
					isFileRaw: true,
					isDto: false,
				});
			}

			if (desc.response && desc.response.schema) {
				desc.response.schema.url = this._getSchemaUrl({
					isRequest: false,
					path: path,
					item: item,
					isFileRaw: false,
					isDto: false,
				});
				desc.response.schema.urlFile = this._getSchemaUrl({
					isRequest: false,
					path: path,
					item: item,
					isFileRaw: true,
					isDto: false,
				});
			}

			var availableMockResponses = this.readDir(mockPath, ['response.txt', '.DS_Store', '*~']);
			availableMockResponses.push({
				file: 'middleware',
			});
			if (this.options.tunnel) {
				availableMockResponses.push({
					file: 'tunnel',
				});
			}
			var availableMockResponsesOut = [];
			var selected;
			try {
				selected = this.readFile(mockPath + '/response.txt');
			} catch (err) {
				selected = 'success';
			}

			this.for(availableMockResponses, function (mockItem) {

				var methodStore = this.getMethodStore(itemPath);
				var validationResult;
				var nameMockItem = mockItem.file.replace('.json', '');

				if (nameMockItem.search(/^\./) >= 0) {
					return;
				}

				if (nameMockItem.search(/\.headers$/) >= 0) {
					return;
				}

				try {
					validationResult = methodStore.validation[nameMockItem].counter;
				} catch (err) {
					validationResult = undefined;
				}

				mockItem.isSelected = (selected === nameMockItem);
				mockItem.name = mockItem.file;
				mockItem.mime = mime.lookup(mockItem.file);
				mockItem.isValidated = (validationResult !== undefined);

				if (mockItem.isValidated) {
					mockItem.isValid = (validationResult < 1);
					mockItem.inValidCounter = validationResult;
				}

				availableMockResponsesOut.push(mockItem);
			}.bind(this));

			if (isDeprecated) {
				desc.status = 'Deprecated';
				statusClass = 'danger';
			}

			if (desc.status === 'swagger-imported') {
				desc.status = 'Imported';
				statusClass = 'success';
			}

			data.push({
				id: nameLower,
				name: name,
				nameLower: nameLower,
				isProtected: desc.protected,
				basePath: path,
				path: itemPath,
				pathCleaned: path.replace(this.options.restPath, '').replace(/#/g, '/').replace(/\/\//g, '/'),
				desc: desc,
				statusClass: statusClass,
				security: (desc.security ? desc.security.join(', ') : ''),
				mockPath: mockPath + '/',
				availableMockResponses: availableMockResponsesOut,
				isDeprecated: isDeprecated ? 'Deprecated' : '',
			});
		}.bind(this));

		return data;
	},

	/**
	 * @param {string} path - methpd directory path
	 * @returns {boolean} is given method deprecated or not
	 * @private
	 */
	_isDeprecated: function (path) {
		var fileData;

		if (typeof this._swaggerImport !== 'object' || !this._swaggerImport.dateTime) {
			return false;
		}

		try {
			fileData = this.readFile(path + '/.is_swagger_deprecated');
		} catch (err) {
			return false;
		}

		return (typeof fileData === 'string');
	},

	/**
	 * @param {string} path - to service method description
	 * @returns {Object} the description object
	 * @private
	 */
	_readApiDesc: function (path) {

		var desc = '{}';

		try {
			desc = this.readFile(path + '/desc.json');
		} catch (err) {
			return {};
		}

		return JSON.parse(desc);
	},

});

module.exports = UserInterface;
