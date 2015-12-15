/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var NodeWatchFileSystem = require("./NodeWatchFileSystem");
var NodeOutputFileSystem = require("./NodeOutputFileSystem");
var NodeJsInputFileSystem = require("enhanced-resolve/lib/NodeJsInputFileSystem");
var CachedInputFileSystem = require("enhanced-resolve/lib/CachedInputFileSystem");

// Node环境插件, 为Node环境初始化文件系统
function NodeEnvironmentPlugin() {}
module.exports = NodeEnvironmentPlugin;
NodeEnvironmentPlugin.prototype.apply = function(compiler) {
	compiler.inputFileSystem = new NodeJsInputFileSystem();
	var inputFileSystem = compiler.inputFileSystem = new CachedInputFileSystem(compiler.inputFileSystem, 60000);
	compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
	compiler.resolvers.context.fileSystem = compiler.inputFileSystem;
	compiler.resolvers.loader.fileSystem = compiler.inputFileSystem;
	compiler.outputFileSystem = new NodeOutputFileSystem();
	compiler.watchFileSystem = new NodeWatchFileSystem(compiler.inputFileSystem);

	// 在 "run" 过程, 清理输入文件系统缓存
	compiler.plugin("run", function(compiler, callback) {
		if(compiler.inputFileSystem === inputFileSystem)
			inputFileSystem.purge();
		callback();
	});
};
