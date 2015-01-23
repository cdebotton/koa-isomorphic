var gulp = require('gulp');
var to5 = require('gulp-6to5');

function to5Task() {
  gulp.src('./src/**/*.js')
    .pipe(to5({blacklist: ['letScoping', 'generators', 'generatorComprehension']}))
    .pipe(gulp.dest('./dist'));
};

gulp.task('default', to5Task);
gulp.task('watch', function() {
  to5Task();
  gulp.watch(['./src/**/*.js'], to5Task);
});
