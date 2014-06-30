var gulp = require('gulp')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')
  , coffee = require('gulp-coffee');

gulp.task('compile', function() {
  gulp.src('./trails.coffee')
    .pipe(coffee({bare: true}).on('error', function (err) {
      console.log('Oops - ', err)
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('build', function() {
  gulp.src('trails.js')
    .pipe(uglify())
    .pipe(rename('trails.min.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
  gulp.watch('*.coffee', ['compile'])
});

gulp.task('default', ['watch']);
