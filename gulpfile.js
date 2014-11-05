var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var rename = require('gulp-rename');

var config = {
    dist: './dist/',
    srcFiles: './src/**/*.js'
};

gulp.task('clean', function () {
    return gulp.src(config.dist, {read: false})
            .pipe(clean());
});


gulp.task('concat', function() {
  return gulp.src(config.srcFiles)
            .pipe(concat('pieces.js'))
            .pipe(gulp.dest(config.dist));
});

gulp.task('minify', function() {
    return gulp.src(config.dist + '*.js')
            .pipe(uglify())
            .pipe(rename('pieces.min.js'))
            .pipe(gulp.dest(config.dist));
});

gulp.task('build', ['clean', 'concat', 'minify']);

gulp.task('default', ['build']);
