var gulp = require('gulp');
var babel = require('gulp-babel');

function babelTask() {
  gulp.src('./src/**/*.js')
    .pipe(babel({
      blacklist: ['regenerator']
    }))
    .pipe(gulp.dest('./dist'));
};

gulp.task('default', babelTask);
gulp.task('watch', function() {
  babelTask();
  gulp.watch(['./src/**/*.js'], babelTask);
});
