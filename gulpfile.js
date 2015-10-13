var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var plumber = require('gulp-plumber');

gulp.task('sass', function() {
    gulp.src('sass/**/*.scss')
      .pipe(plumber())
      .pipe(sass({
        style: 'compressed',
        compass : true
      }))
      .pipe(gulp.dest('static/assets/css/'));
});

gulp.task('default', function() {
  gulp.watch('sass/**/*.scss', ['sass']);
});
