/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var async = require("async");

function CachePlugin(cache) {
	this.cache = cache || {};
}
module.exports = CachePlugin;

// 缓存插件
CachePlugin.prototype.apply = function(compiler) {
	if(Array.isArray(compiler.compilers)) {
		compiler.compilers.forEach(function(c, idx) {
			c.apply(new CachePlugin(this.cache[idx] = this.cache[idx] || {}));
		}, this);
	} else {
		// 在 "compilation" 中, 将当前的缓存设置给当前的 compilation
		compiler.plugin("compilation", function(compilation) {
			compilation.cache = this.cache;
		}.bind(this));

		// 在 "run" 阶段, 缓存插件记录文件的修改时间戳, 并保存到 compiler.fileTimestamps 上
		// > 要记录缓存, 在一次编译之后才能进行
		compiler.plugin("run", function(compiler, callback) {
			if(!compiler._lastCompilationFileDependencies) return callback();
			var fs = compiler.inputFileSystem;
			var fileTs = compiler.fileTimestamps = {};
			async.forEach(compiler._lastCompilationFileDependencies, function(file, callback) {
				fs.stat(file, function(err, stat) {
					if(err) {
						// 如果文件不存在, 就不做处理
						if(err.code === "ENOENT") return callback();
						return callback(err);
					}

					fileTs[file] = stat.mtime || Infinity;
					callback();
				});
			}, callback);
		});

		// 在 "after-compile" 之后, 记录最后的 文件依赖 和 上下文依赖
		// > 这两个依赖都记录在编译器上
		compiler.plugin("after-compile", function(compilation, callback) {
			compilation.compiler._lastCompilationFileDependencies = compilation.fileDependencies;
			compilation.compiler._lastCompilationContextDependencies = compilation.contextDependencies;
			callback();
		});
	}
};
