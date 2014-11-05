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
    gulp.src(config.srcFiles)
            .pipe(concat('pieces.js'))
            .pipe(gulp.dest(config.dist));
});

gulp.task('minify', function() {
    gulp.src(config.dist + '*.js')
            .pipe(rename('pieces.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(config.dist));
});

gulp.task('build', ['concat', 'minify']);

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['build']);
});

gulp.task('default', ['build']);
