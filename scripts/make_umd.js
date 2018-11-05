#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const pkg = require('../package.json');

const compilerFilePath = path.resolve('closure-compiler-v20180506.jar');
const filePath = path.resolve('bin/zanejs.js');
const minFilePath = path.resolve('bin/zanejs.min.js');

const fileContent = '' + fs.readFileSync(filePath);
const umdCode = `
(function (root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("${pkg.name}", [], factory);
	else if(typeof exports === 'object')
		exports["${pkg.name}"] = factory();
	else
		root["${pkg.name}"] = factory();
})(window, function() {
	var zanejs = {};
	${fileContent}
	return zanejs;
});
`;

fs.writeFileSync(
	filePath,
	umdCode.replace(/var zanejs;/g, '')
);

var args = [
	'-jar', compilerFilePath
];
args.push('--js', filePath);
args.push('--js_output_file', minFilePath);
var child = spawn('java', args);
child.stdout.on('data', function(data) {
	console.log(data.toString());
});

child.stderr.on("data", function (data) {
	console.log(data.toString());
});
child.on('exit', function (code) {
	// console.log('child process exited with code ' + code);
	console.log('compiler is over!');
})
