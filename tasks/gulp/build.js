const gulp = require("gulp");
const { path } = require("app-root-path")
const runSequence = require('run-sequence');
const ts = require('gulp-typescript');
const merge = require('merge2');
const sourcemaps = require('gulp-sourcemaps');

const tsProject = ts.createProject(path + '/tsconfig.json', {removeComments: false, declaration: true});

gulp.task('_build', () => {
	const stream = gulp.src(path + '/.tmp/src/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(tsProject());
	
	return merge([
		stream.js
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('dist')),
		stream.dts.pipe(gulp.dest('dist'))
	]);
});

gulp.task("build", [], callback => {
	return runSequence("clean", ["worker", "copy"], "_build", callback);
});