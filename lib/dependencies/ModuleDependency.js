/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var Dependency = require("../Dependency");

// 模块依赖对象
function ModuleDependency(request) {
	Dependency.call(this);
	// 待处理/请求的文件 (userRequest ???)
	this.request = request;
	this.userRequest = request;
}
module.exports = ModuleDependency;

ModuleDependency.prototype = Object.create(Dependency.prototype);
ModuleDependency.prototype.constructor = ModuleDependency;
ModuleDependency.prototype.isEqualResource = function isEqualResource(other) {
	if(!(other instanceof ModuleDependency))
		return false;
	return this.request === other.request;
};
