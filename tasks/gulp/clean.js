const gulp = require('gulp');
const del = require('del');
const path = require('app-root-path').path;

/**
 * Clean Destination Folder
 */
gulp.task('clean:dist', () => {
	return del([path + '/dist'], { force: true });
});

gulp.task('clean:tmp', () => {
	return del([path + '/.tmp'], { force: true });
});

gulp.task("clean", ["clean:dist", "clean:tmp"]);
