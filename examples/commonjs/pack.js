/*
* @Author: zoujie.wzj
* @Date:   2015-12-09 20:39:53
* @Last Modified by:   zoujie.wzj
* @Last Modified time: 2015-12-09 20:43:42
*/

'use strict';

var webpack = require('../../lib/webpack');
var path = require('path');

webpack({
	entry: "./example.js",
	output: {
		path: path.join(__dirname, 'js'),
		filename: 'output.js'
	}
}, function (err) {
	console.error(err);
});