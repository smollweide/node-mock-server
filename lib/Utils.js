'use strict';

var fs = require('fs');
var log = require('chip')();
var Minimatch = require('minimatch').Minimatch;
var jQueryExtend = require('extend');

/**
 *
 * @class Utils
 * @namespace node-mock-server
 * @constructor
 *
 * Swagger importer
 */
function Utils() {
	this.init();
}

Utils.prototype = {

	constructor: Utils,

	/**
	 *
	 * @method init
	 * called by constructor
	 * @returns void
	 * @public
	 */
	init: function () {
	},

	/**
	 *
	 * @method forIn
	 * @param {object} obj
	 * @param {function} callback
	 * @returns void
	 * @public
	 */
	forIn: function (obj, cbForIn) {
		// eslint-disable-next-line
		for (var key in obj) {
			// eslint-disable-next-line
			if (obj.hasOwnProperty(key)) {
				cbForIn.call(this, key, obj[key]);
			}
		}
	},

	/**
	 *
	 * @method for
	 * @param {Array} arr
	 * @param {function} callback
	 * @returns void
	 * @public
	 */
	for: function (arr, cbFor) {

		var i;
		var len = arr.length;

		for (i = 0; i < len; i += 1) {
			cbFor.call({}, arr[i], i);
		}
	},

	/**
	 *
	 * @method isFilledString
	 * @param {string} value
	 * @returns {boolean} isFilledString
	 * @public
	 */
	isFilledString: function (value) {
		return (typeof value === 'string' && value !== '');
	},

	/**
	 *
	 * @method getStats
	 * @param {string} dirFileName
	 * @returns {object} getStats
	 * @public
	 */
	getStats: function (dirFileName) {
		return fs.statSync(dirFileName);
	},

	/**
	 *
	 * @method isDir
	 * @param {string} dirName
	 * @returns {boolean} isDir
	 * @public
	 */
	existDir: function (dirName) {

		var isDir = false;

		try {
			isDir = this.getStats(dirName).isDirectory();
		} catch (err) {
			return false;
		}

		return isDir;
	},


	/**
	 *
	 * @method existFile
	 * @param {string} path
	 * @returns {boolean} isFile
	 * @public
	 */
	existFile: function (path) {

		var isFile = false;

		try {
			isFile = this.getStats(path).isFile();
		} catch (err) {
			return false;
		}

		return isFile;
	},

	/**
	 *
	 * @method writeDir
	 * @param {string} dirName
	 * @public
	 */
	writeDir: function (dirName) {
		if (!this.existDir(dirName)) {
			fs.mkdirSync(dirName);
		}
	},

	/**
	 *
	 * @method writeFile
	 * @param {string} path
	 * @param {object} data
	 * @public
	 */
	writeFile: function (path, data) {
		fs.writeFileSync(path, data);
	},

	/**
	 *
	 * @method readFile
	 * @param {string} path
	 * @returns {string}
	 * @public
	 */
	readFile: function (path) {
		return fs.readFileSync(path, 'utf8');
	},

	/**
	 *
	 * @method removeFile
	 * @param {string} path
	 * @public
	 */
	removeFile: function (path) {
		try {
			fs.unlinkSync(path);
		} catch (err) {
			return;
		}
	},

	/**
	 *
	 * @method readDir
	 * @param {string} dir
	 * @param {Array|undefined} ignoreFiles
	 * @public
	 */
	readDir: function (dir, ignoreFiles) {
		var results = [];
		var list = [];

		ignoreFiles = ignoreFiles || ['.DS_Store'];

		try {
			list = fs.readdirSync(dir);
		} catch (err) {
			if (process.env.NODE_ENV !== 'test') {
				log.error('Folder "' + err.path + '" not found!');
			}
		}

		list.forEach(function (file) {
			var ignored = false;
			for (var i = 0; i < ignoreFiles.length; i++) {
				var minimatch = new Minimatch(ignoreFiles[i]);
				if (minimatch.match(file)) {
					ignored = true;
					break;
				}
			}
			if (!ignored) {
				results.push({
					path: dir + '/' + file,
					file: file,
				});
			}
		});
		return results;
	},

	/**
	 *
	 * @method removeDir
	 * @param {string} path
	 * @public
	 */
	removeDir: function (path) {
		try {
			if (fs.existsSync(path)) {
				fs.readdirSync(path).forEach(function (file) {
					var curPath = path + '/' + file;
					if (fs.lstatSync(curPath).isDirectory()) {
						// recurse
						this.removeDir(curPath);
					} else {
						// delete file
						fs.unlinkSync(curPath);
					}
				});
				fs.rmdirSync(path);
			}
		} catch (err) {
			return;
		}
	},

	/**
	 * Capitalizes the first letter of the given string.
	 *
	 * @method capitalize
	 * @param {String} str
	 *      The original string
	 * @return {String}
	 *      The capitalized string
	 */
	capitalize: function (str) {
		// Capitalize the first letter
		return str.substr(0, 1).toUpperCase().concat(str.substr(1));
	},

	/**
	 * Decapitalizes the first letter of the given string.
	 *
	 * @method capitalize
	 * @param {String} str
	 *      The original string
	 * @return {String}
	 *      The decapitalized string
	 */
	decapitalize: function (str) {
		// Decapitalize the first letter
		return str.substr(0, 1).toLowerCase().concat(str.substr(1));
	},

	/**
	 * Camelizes the given string.
	 *
	 * @method toCamel
	 * @param {String} str
	 *      The original string
	 * @return {String}
	 *      The camelized string
	 */
	toCamel: function (str) {
		return str.replace(/(-[A-Za-z])/g, function ($1) {
			return $1.toUpperCase().replace('-', '');
		});
	},

	/**
	 *
	 * @method getPreferences
	 * @param {object} obj
	 * @returns {object} preferences
	 * @public
	 */
	getPreferences: function (obj) {
		var data = {};
		var file = obj.restPath + '/preferences.json';

		try {
			data = JSON.parse(this.readFile(file));
		} catch (err) {
			return {};
		}

		return data;
	},

	/**
	 *
	 * @method getMethodStore
	 * @param {string} path
	 * @returns {object}
	 * @public
	 */
	getMethodStore: function (path) {

		var pathFull = path + '/.store.json';

		if (!this.existFile(pathFull)) {
			return {};
		}

		try {
			return JSON.parse(this.readFile(pathFull));
		} catch (err) {
			return {};
		}
	},

	/**
	 *
	 * @method setMethodStore
	 * @param {string} path
	 * @param {object} data
	 * @returns {void}
	 * @public
	 */
	setMethodStore: function (path, data) {

		var pathFull = path + '/.store.json';
		var originalData = this.getMethodStore(path);
		var outData = jQueryExtend(true, originalData, data);

		this.writeFile(pathFull, JSON.stringify(outData, null, 2));
	},

	/**
	 *
	 * @method typeOf
	 * @param {*} value
	 * @returns {String}
	 * @public
	 */
	typeOf: function (value) {
		return (value instanceof Array) ? 'array' : typeof value;
	},

	/**
	 *
	 * @method cleanPath
	 * @param {Object} options
	 * @param {String} path
	 * @returns {String}
	 * @public
	 */
	cleanPath: function (options, path) {

		if (typeof path !== 'string') {
			return '';
		}

		if (typeof options !== 'object' || !options.restPath) {
			return path;
		}

		return path.replace(options.restPath, '');
	},

	/**
	 *
	 * @method cleanString
	 * @param {string} value
	 * @returns {string}
	 * @public
	 */
	cleanString: function (value) {
		if (!this.isFilledString(value)) {
			return undefined;
		}
		return value.toLowerCase().replace(/[^a-z0-9]/g, '');
	},

};

module.exports = Utils;
