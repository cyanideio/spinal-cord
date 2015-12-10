var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');

gulp.task('default', () => {
    return gulp.src(['exo.js'])
        .pipe(sourcemaps.init())
        .pipe(browserify({}))
        .pipe(concat('exo.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});
