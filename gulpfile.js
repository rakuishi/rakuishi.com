var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var plumber = require('gulp-plumber');
var critical = require('critical');

// $ gulp sass
gulp.task('sass', function() {
    gulp.src('sass/**/*.scss')
      .pipe(plumber())
      .pipe(sass({
        style: 'compressed',
        compass : true
      }))
      .pipe(gulp.dest('static/css/'));
});

// $ gulp watch
gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['sass']);
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