
'use strict';

var express = require('express');
var https = require('https');
var open = require('open');
var app = express();
var bodyParser = require('body-parser');
var log = require('chip')();
var util = require('util');
var extend = util._extend;
var Utils = require('../Utils');
var _defaults = require('../defaults/options-defaults');
var AppControllerSingleton;

/**
 *
 * @class AppController
 * @param {object} options
 * @constructor
 *
 */
function AppController(options) {
	this.init(options);
}

AppController.prototype = extend(AppController.prototype, Utils.prototype);
AppController.prototype = extend(AppController.prototype, {

	constructor: AppController,

	_defaults: _defaults,

	/**
	 *
	 * @method init
	 * called by constructor
	 * @param {object} options
	 * @param {string} options.dirName
	 * @param {object} options.swaggerImport
	 * @param {string} options.privateKey
	 * @param {string} options.certificate
	 * @param {boolean} options.open
	 * @param {string|undefined} options.jsVersion
	 * @public
	 */
	init: function (options) {

		var _this = this;
		options = extend(this._defaults, options || {});

		var logFunc = function () {
			if (process.env.NODE_ENV !== 'test') {
				log.info('server started at port ' + options.port);
				if (options.open) {
					open(options.urlBase + options.uiPath);
				}
			}
			if (typeof options.onServerStarted === 'function') {
				options.onServerStarted(_this.app, _this.server);
			}
		};

		this.options = options;
		this.app = app;

		if (!this.options.dirName) {
			log.error('options.dirName is required (dirName: __dirname)');
			return;
		}

		if (this.options.swaggerImport) {
			this.options.swaggerImport.dirName = this.options.dirName;
		}

		if (this.options.expressMiddleware instanceof Array) {
			this.options.expressMiddleware.forEach(function (middlewareCallback) {
				var args = middlewareCallback(express);
				if (args instanceof Array) {
					if (args.length === 1) {
						app.use(args[0]);
					} else if (args.length === 2) {
						app.use(args[0], args[1]);
					} else if (args.length === 3) {
						app.use(args[0], args[1], args[2]);
					}
				} else if (typeof args === 'function') {
					app.use(args);
				}
			});
		}

		app.use('/src', express.static(__dirname + '/../../src'));
		app.use('/node_modules', express.static(__dirname + '/../../node_modules'));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.set('view engine', 'ejs');
		app.set('views', __dirname + '/../../views');

		if (this.options.privateKey && this.options.certificate) {
			this.server = https.createServer({
				key: this.options.privateKey,
				cert: this.options.certificate,
			}, app).listen(this.options.port, logFunc);

			return;
		}

		this.server = app.listen(this.options.port, logFunc);
	},

});

// eslint-disable-next-line
AppControllerSingleton = (function () {
	var instance;

	function createInstance(options) {
		return new AppController(options);
	}

	return {
		getInstance: function (options) {
			if (!instance && options) {
				instance = createInstance(options);
			}
			return instance;
		},
	};
})();

module.exports = AppControllerSingleton;
