var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');

gulp.task('sass', function() {
    gulp.src('sass/**/*.scss')
      .pipe(plumber())
      .pipe(sass({
        style: 'compressed',
        compass : true
      }))
      .pipe(gulp.dest('static/assets/css/'));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./public/"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('default', ['browser-sync'], function() {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch(['./*.html', './css/style.css'], ['bs-reload']);
});
