const gulp = require("gulp");
const webpack = require("webpack");
const gutil = require('gulp-util');
const { path } = require("app-root-path");
const fs = require("fs");
const runSequence = require('run-sequence');

const config = require("./db-worker.webpack");

gulp.task("compile:db-worker", [], () => {
	const bundler = webpack(config);

	return new Promise((resolve, reject) => {
		bundler.run((err, stats) => {
			if (err) {
				gutil.log(gutil.colors.red(err.toString()));
				reject();
			}
			gutil.log(stats.toString({
				colors: true,
				chunks: false,
				hash: false,
				version: false
			}));
			resolve();
		});
	});
});

gulp.task("parse:db-worker", [], () => {
	const str = fs.readFileSync(path + "/.tmp/worker.js", "utf8");
	const file = "const script = \`" + str.replace(/\\n|\\t/g, "") + "\`; export default script;";
	fs.writeFileSync(path + "/.tmp/src/worker.ts", file, "utf8");
});

gulp.task("worker", [], callback => {
	return runSequence("compile:db-worker", "parse:db-worker", callback);
});
