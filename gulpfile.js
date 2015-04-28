var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var plumber = require('gulp-plumber');
var critical = require('critical');
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

gulp.task('critical', function () {
  critical.generateInline({
      base: 'public/',
      src: 'index.html',
      htmlTarget: 'index.html',
      width: 320,
      height: 480,
      minify: true
    });
});