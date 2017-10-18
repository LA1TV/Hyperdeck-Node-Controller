var jshint = require('gulp-jshint')
var gulp = require('gulp')

gulp.task('lint', function () {
  return gulp.src(['*.js', '**/*.js', '!node_modules/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
})

gulp.task('default', ['lint'])
