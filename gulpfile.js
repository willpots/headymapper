var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');

gulp.task('default', ['sass', 'js'], function() {});

gulp.task('js', function() {
  gulp.src('js/main.js')
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', function() {
  gulp.src('./scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function() {
  gulp.watch('scss/*.scss', ['sass']);
  gulp.watch('js/*.js', ['js']);
});