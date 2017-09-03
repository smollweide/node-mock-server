
'use strict';

var express = require('express');
var https = require('https');
var open = require('open');
var jQueryExtend = require('extend');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var log = require('chip')();
var defaultOptions = require('../lib/defaults/options-defaults');
var options = require('./options');

var app = express();
var server;
options = jQueryExtend(defaultOptions, options);

var logFunc = function () {
	if (process.env.NODE_ENV !== 'test') {
		log.info('server started at port ' + options.tunnel.port);
		if (options.open) {
			open('http://localhost:' + options.tunnel.port);
		}
	}
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

function setHeaders(res) {
	res.setHeader('Test', "test");
	res.setHeader('Content-Type', options.contentType);
	res.setHeader('Access-Control-Expose-Headers', options.accessControlExposeHeaders);
	res.setHeader('Access-Control-Allow-Origin', options.accessControlAllowOrigin);
	res.setHeader('Access-Control-Allow-Methods', options.accessControlAllowMethods);
	res.setHeader('Access-Control-Allow-Headers', options.accessControlAllowHeaders);
}

app.get('/rest/v1/products', (req, res) => {
	setHeaders(res);
	var response = { tunnelResponse: { success: true, headers: req.headers } };
	res.send(JSON.stringify(response, null, 2));
	res.end();
});
app.post('/rest/v1/products/:productCode', (req, res) => {
	setHeaders(res);
	var body = jQueryExtend(req.body, {
		productCode: req.params.productCode,
		query: req.query
	});
	res.cookie('cookieName', 'my-cookie', { maxAge: 900000, httpOnly: true });
	res.send(JSON.stringify(body, null, 2));
	res.end();
});

if (options.tunnel.privateKey && options.tunnel.certificate) {
	server = https.createServer({
		key: options.tunnel.privateKey,
		cert: options.tunnel.certificate,
	}, app).listen(options.tunnel.port, logFunc);
} else {
	server = app.listen(options.tunnel.port, logFunc);
}
