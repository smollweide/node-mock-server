
'use strict';

var extend = require('util')._extend;
var request = require('request');
var Utils = require('./Utils');
var deasync = require('deasync');

/**
 *
 * @class GetResponse
 * @namespace GetResponse
 * @param {object} options
 * @param {object} serverOptions
 * @constructor
 *
 * Swagger importer
 */
function GetResponse(options, serverOptions) {
	this.init(options, serverOptions);
}

GetResponse.prototype = extend(GetResponse.prototype, Utils.prototype);
GetResponse.prototype = extend(GetResponse.prototype, {

	constructor: GetResponse,

	_defaults: {
		path: undefined,
		method: undefined,
		expected: undefined,
		serverOptions: undefined,
		queryParams: {},
	},

	/**
	 *
	 * @method init
	 * called by constructor
	 * @param {object} options
	 * @param {object} serverOptions
	 * @public
	 */
	init: function (options, serverOptions) {

		options = extend(this._defaults, options || {});

		this._options = options;
		this._serverOptions = serverOptions;
		this._requestData = this._getRequestData();
		this._cleanPath = this._getCleanPath();
	},

	/**
	 * @method get
	 * @returns {*}
	 * @public
	 */
	get: function () {
		return this._fetchApiData();
	},

	/**
	 * @method _getCleanPath
	 * @returns {string}
	 * @private
	 */
	_getCleanPath: function () {
		return this._options.path
			.replace(this._serverOptions.restPath, '')
			.replace(/#/g, '/')
			.replace(/\/\//g, '/')
			.replace(/{[^}]*}/g, 'test');
	},

	/**
	 * @method _getUrl
	 * @returns {string}
	 * @private
	 */
	_getUrl: function () {

		var url = [];
		var urlOut;
		var getParams = [];

		url.push(this._serverOptions.urlPath);
		url.push(this._cleanPath);

		urlOut = this._serverOptions.urlBase + url.join('').replace(/\/\//g, '/');

		// add getParams
		this.forIn(this._requestData, function (key, value) {
			getParams.push(key + '=' + value);
		});
		this.forIn(this._options.queryParams, function (key, value) {
			getParams.push(key + '=' + value);
		});

		urlOut += '?_expected=' + this._options.expected.replace(/\.json$/, '') + '&' + getParams.join('&');

		return urlOut;
	},

	/**
	 * @method _getRequestData
	 * @returns {object}
	 * @private
	 */
	_getRequestData: function () {

		var path = [];
		var data;
		var filePath;

		path.push(this._options.path);
		path.push(this._options.method.toUpperCase());
		path.push('mock');
		path.push('.request_data.json');

		filePath = path.join('/');

		if (!this.existFile(filePath)) {
			return {};
		}

		data = this.readFile(filePath);

		try {
			return JSON.parse(data);
		} catch (err) {
			return data;
		}
	},

	/**
	 * @method _fetchApiData
	 * @returns {*}
	 * @private
	 */
	_fetchApiData: function () {

		var _this = this;
		var method = this._options.method.toUpperCase();

		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

		function anticipatedSyncFunction() {
			var ret;

			request({
				uri: _this._getUrl(),
				method: method || 'GET',
				form: _this._requestData,
			}, function (error, res, data) {
				if (!error) {

					var newData = data;

					try {
						newData = JSON.parse(data);
					} catch (err) {
						ret = newData;
					}

					ret = newData;
				} else {
					ret = {};
				}
			});
			while (ret === undefined) {

				deasync.runLoopOnce();
			}
			return ret;
		}

		return anticipatedSyncFunction();
	},

});

module.exports = GetResponse;
