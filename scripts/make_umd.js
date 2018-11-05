#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var filePath = path.resolve(__dirname, '../bin/zanejs.js');
var fileContent = '' + fs.readFileSync(filePath);

var umdCode = `
(function (root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("zanejs", [], factory);
	else if(typeof exports === 'object')
		exports["zanejs"] = factory();
	else
		root["zanejs"] = factory();
})(window, function() {
	var zanejs = {};
	${fileContent}
	return zanejs;
});
`;

fs.writeFileSync(
	path.resolve('bin/zanejs.umd.js'),
	umdCode.replace(/var zanejs;/g, '')
);
