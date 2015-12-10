var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var watch = require('gulp-watch');

gulp.task('default', () => {
    return gulp.src(['tests.js'])
        .pipe(sourcemaps.init())
        .pipe(browserify({}))
        .pipe(concat('tests.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});
