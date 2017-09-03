/* eslint no-console: 0 */

var log = require('chip')();
var Utils = require('./../Utils');
var utils = new Utils();
var activateCollection = require('../commands/activate-collection');
var util = require('util');
var extend = util._extend;
var _defaults = require('../defaults/options-defaults');

function activateCollectionCli(options) {
	options = extend(_defaults, options || {});
	if (activateCollection(process.argv[3], options)) {
		log(`collection "${process.argv[3]}" activated`);
	}
}

function collectionsCli(options) {

	var path = `${options.restPath}/_collections`;

	console.log('AVAILABLE COLLECTIONS:');
	console.log('- reset');
	console.log('- tunnel');
	console.log('- tunnel-latest');
	utils.readDir(path).forEach(function (dirItem) {
		console.log(`- ${dirItem.file}`);
	});
}

var exportFunc;

if (process.argv.length > 3) {
	exportFunc = activateCollectionCli;
} else {
	exportFunc = collectionsCli;
}

module.exports = exportFunc;
