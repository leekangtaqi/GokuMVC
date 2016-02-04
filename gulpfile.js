var gulp = require('gulp');
var ts = require('gulp-typescript');
var watch = require('gulp-watch');
var backendProject = ts.createProject('./tsconfig.json');

gulp.task('backend-ts', function() {
    return backendProject.src() // instead of gulp.src(...) 
               .pipe(ts(backendProject))
               .pipe(gulp.dest('./build'));
});

gulp.task('build', ['backend-ts'], function() {
    console.log('build ok');
    // return gulp.watch(['./src/app.ts'], ['compile-ts']);
});