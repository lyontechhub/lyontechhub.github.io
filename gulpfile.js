var gulp = require('gulp');
var del = require('del')
var deploy = require("gulp-gh-pages");
var less = require("gulp-less");
var amdOptimize = require('amd-optimize');
var concat = require('gulp-concat');

/* Configuration */
var lessSource = 'css/**/*.less';
var jsSource = 'js/**/*.js';
var htmlSource = '**/*.html';
var data = 'data/**/*';
var images = 'imgs/**/*';
var destDir = "dist/";

/* Tasks */
gulp.task('clean', function () {
   del('dist', true);
});

gulp.task('copy-data', function () {
   return gulp.src(data)
       .pipe(gulp.dest(destDir + 'data'));
});

gulp.task('copy-images', function () {
    return gulp.src(images)
        .pipe(gulp.dest(destDir + 'imgs'));
});

gulp.task('build-css', function () {
    return gulp.src(lessSource)
        .pipe(less())
        .pipe(gulp.dest(destDir + 'css'));
});

gulp.task('build-js', function () {
    return gulp.src(jsSource)
        .pipe(amdOptimize('main', {
            baseUrl: 'js',

            paths: {
                'jquery': 'empty:',
                'domReady': 'empty:',
                'angular': 'empty:',
                'angularRoute': '../bower_components/angular-route/angular-route.min',
                'angularStrapNavBar': '../bower_components/angular-strap/dist/modules/navbar.min'
            },

            shim: {
                'angular': {
                    deps: ['jquery'],
                    exports: 'angular'
                },
                'angularRoute': {
                    deps: ['angular']
                },
                'angularStrapNavBar': {
                    deps: ['angular']
                }
            }}))
        .pipe(concat('build.min.js'))
        .pipe(gulp.dest(destDir + 'js'));
});

gulp.task('build-html', function () {
    return gulp.src(htmlSource)
        .pipe(gulp.dest(destDir));
});

gulp.task('dev', ['copy-images', 'copy-data', 'build-css', 'build-js', 'build-html']);

gulp.task('deploy', function () {
    var options = {
        "branch": "master",
        "push": false
    }
    gulp.src("./dist/**/*")
        .pipe(deploy(options));
});