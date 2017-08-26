const gulp = require("gulp");
const { path } = require("app-root-path")

gulp.task("copy", [], () => {
	return gulp.src(path + "/src/*.ts")
		.pipe(gulp.dest(path + "/.tmp/src"));
});