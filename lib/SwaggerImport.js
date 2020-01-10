
'use strict';

var YAML = require('yamljs');
var extend = require('util')._extend;
var swaggerLog = require('./SwaggerLog');
var Utils = require('./Utils');
var SwaggerPath = require('./SwaggerPath');
var SwaggerDefinition = require('./SwaggerDefinition');

/**
 *
 * @class SwaggerImport
 * @namespace SwaggerImport
 * @param {object} options
 * @constructor
 *
 * Swagger importer
 */
function SwaggerImport(options) {
	this.init(options);
}

SwaggerImport.prototype = extend(SwaggerImport.prototype, Utils.prototype);
SwaggerImport.prototype = extend(SwaggerImport.prototype, {

	constructor: SwaggerImport,

	_defaults: {
		protocol: 'http',
		authUser: undefined,
		authPass: undefined,
		host: undefined,
		port: 80,
		path: '',
		dest: undefined,
		createErrorFile: true,
		createEmptyFile: true,
		overwriteExistingDescriptions: true,
		replacePathsStr: '',
		isTest: false,
		agent: undefined,
	},

	/**
	 *
	 * @method init
	 * called by constructor
	 * @param {object} options
	 * @param {string|undefined} options.protocol
	 * @param {string|undefined} options.authUser
	 * @param {string|undefined} options.authPass
	 * @param {string} options.host
	 * @param {number} options.port
	 * @param {string} options.path
	 * @param {string} options.dest
	 * @param {boolean|undefined} options.yaml
	 * @param {boolean|undefined} options.createErrorFile
	 * @param {boolean|undefined} options.createEmptyFile
	 * @param {boolean|undefined} options.overwriteExistingDescriptions
	 * @public
	 */
	init: function (options) {

		options = extend(this._defaults, options || {});

		swaggerLog.clear();
		swaggerLog.neutral('swagger import started');

		this._options = options;
		this._host = options.host;
		this._path = options.path;
		this._dest = options.dest;
		this._isValid = true;
		this._data = {};
		this._swaggerDefinitions = {};
		this._swaggerPaths = {};
		this._yaml = options.yaml;

		if (!this.isFilledString(this._host)) {
			this._isValid = false;
			swaggerLog.error('<code>options.swaggerImport.host</code> can\'t be empty!');
		}

		if (!this.isFilledString(this._path)) {
			this._isValid = false;
			swaggerLog.error('<code>options.swaggerImport.path</code> can\'t be empty!');
		}

		if (!this.isFilledString(this._dest)) {
			this._isValid = false;
			swaggerLog.error('<code>options.swaggerImport.dest</code> can\'t be empty!');
		}

	},

	/**
	 *
	 * @method doImport
	 * @public
	 */
	doImport: function (importCb) {

		if (!this._isValid) {
			return false;
		}

		this._fetchApiData(function () {
			swaggerLog.success('fetched data from swagger api');
			this._storeDefinitions();
			this._storePaths();
			this._write();
			swaggerLog.success('done');
			if (typeof importCb === 'function') {
				importCb.call(this);
			}
		}.bind(this));
	},

	/**
	 * @method _parseData
	 * @param {string} data 
	 * @returns {string} parsed data
	 * @private
	 */
	_parseData: function (data) {
		var _this = this;
		return _this._yaml
		? YAML.parse(data)
		: JSON.parse(data)
	},
	/**
	 * @method _fetchApiData
	 * @param {function} fetchDone
	 * @returns void
	 * @private
	 */
	_fetchApiData: function (fetchDone) {

		var _this = this;
		var opt = this._options;

		if (opt.isTest) {
			_this._storeApiData(_this._parseData(this.readFile('.' + opt.path)));
			fetchDone();
			return;
		}

		/**
		 * @method _onReceiveApiData
		 * @param {object} res
		 * @private
		 */
		function _onReceiveApiData(res) {
			var data = '';

			res.on('data', function (chunk) {
				data += chunk.toString('utf8');
			});

			res.on('end', function () {
				var parsedData = _this._parseData(data);
				_this._storeApiData(parsedData);
				fetchDone();
			});
		}

		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
		// eslint-disable-next-line
		require(opt.protocol).get(this._buildOptions(), _onReceiveApiData).on('error', console.log);
	},

	/**
	 * @method _buildOptions
	 * @returns {object} options
	 * @private
	 */
	_buildOptions: function () {
		var opt = this._options;
		var protocol = opt.protocol;
		if (/http$|https$/.test(protocol)) {
			protocol += ':';
		}
		var opts = {
			protocol: protocol,
			host: opt.host,
			port: opt.port,
			path: opt.path,
		};
		if (opt.authUser && opt.authPass) {
			opts.auth = [opt.authUser, ':', opt.authPass].join('');
		}
		if (opt.agent) {
			opts.agent = opt.agent;
		}
		return opts;
	},

	/**
	 * @method _storeApiData
	 * @param {object} data
	 * @param {object} data.paths
	 * @private
	 */
	_storeApiData: function (data) {
		this._data = data;
	},

	/**
	 * @method _storeDefinitions
	 * @returns void
	 * @private
	 */
	_storeDefinitions: function () {

		this.forIn(this._data.definitions, function (key, value) {
			this._swaggerDefinitions[key] = new SwaggerDefinition(key, value, this._options);
		}.bind(this));

		this.forIn(this._swaggerDefinitions, function (key, swaggerDefinition) {
			swaggerDefinition.setSwaggerDefinitions(this._swaggerDefinitions);
			swaggerDefinition.mapReferences();
		});

	},

	/**
	 * @method _storePaths
	 * @returns void
	 * @private
	 */
	_storePaths: function () {

		this.forIn(this._data.paths, function (key, value) {
			var swaggerPath = new SwaggerPath(key, value, this._options);
			swaggerPath.setDefinitions(this._swaggerDefinitions);
			this._swaggerPaths[key] = swaggerPath;
		}.bind(this));

	},

	/**
	 * @method _removeOldSwaggerHiddenFiles
	 * @returns void
	 * @private
	 */
	_removeOldSwaggerHiddenFiles: function () {

		var root;

		this.removeFile(this._dest + '/.swagger_import.json');

		if (this.existDir(this._dest)) {
			root = this.readDir(this._dest, []);

			this.for(root, function (rootDir) {
				this.for(this.readDir(rootDir.path, []), function (pathDir) {
					this.for(this.readDir(pathDir.path, []), function (methodPath) {
						if (this.existFile(methodPath.path + '/.is_swagger_imported')) {
							this.removeFile(methodPath.path + '/.is_swagger_imported');
							this.writeFile(methodPath.path + '/.is_swagger_deprecated', '');
						}
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}
	},

	/**
	 * @method _writeSwaggerHiddenFile
	 * @returns void
	 * @private
	 */
	_writeSwaggerHiddenFile: function () {
		var date = new Date();
		var data = {};

		data.dateTime = date.toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' GMT+0000';

		this.writeFile(this._dest + '/.swagger_import.json', JSON.stringify(data));
	},

	/**
	 * @method _write
	 * @returns void
	 * @private
	 */
	_write: function () {
		this._removeOldSwaggerHiddenFiles();

		if (!this.existDir(this._dest)) {
			this.writeDir(this._dest);
		}

		this.forIn(this._swaggerPaths, function (key, swaggerPath) {
			swaggerPath.write();
		});

		this.forIn(this._swaggerDefinitions, function (key, swaggerDefinition) {
			swaggerDefinition.write();
		});

		this._writeSwaggerHiddenFile();
	},

});

module.exports = SwaggerImport;
