var gulp = require('gulp');
var del = require('del')
var deploy = require("gulp-gh-pages");
var less = require("gulp-less");
var amdOptimize = require('amd-optimize');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var argv = require('yargs').argv;
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var git = require('gulp-gh-pages/lib/git');
var gutil = require('gulp-util');
var when = require('when');
var path = require('path');
var runSequence = require('run-sequence');

/* Configuration */
var lessSource = 'css/main.less';
var jsSource = 'js/**/*.js';
var htmlSource = ['views/*.html', 'index.html'];
var assetsSource = ['imgs/**/*', 'data/**/*'];
var destDir = 'dist/';
var deployOptions = {
    "origin": 'origin',
    "branch": "master"
}
var tmpRepoPath = '';

/* Tasks */
gulp.task('clean', function () {
    del('dist', true);
});

gulp.task('build-css', function () {
    return gulp.src(lessSource, { base: './' })
        .pipe(less({ paths: [ 'bower_components/bootstrap/less/' ] }))
        .pipe(gulpIf(argv.push, minifyCSS()))
        .pipe(gulp.dest(destDir));
});

gulp.task('watch-css', function() {
    gulp.watch(lessSource, ['build-css']);
});

gulp.task('build-js', function () {
    return gulp.src(jsSource, { base: './' })
        .pipe(amdOptimize('main', {
            baseUrl: 'js',

            paths: {
                'jquery': 'empty:',
                'bootstrap': 'empty:',
                'domReady': 'empty:',
                'angular': 'empty:',
                'angularRoute': '../bower_components/angular-route/angular-route',
                'angularStrapNavBar': '../bower_components/angular-strap/dist/modules/navbar'
            },

            shim: {
                'bootstrap': {
                    deps: ['jquery']
                },
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
        .pipe(concat('js/build.min.js'))
        .pipe(gulpIf(argv.push, uglify()))
        .pipe(gulp.dest(destDir));
});

gulp.task('watch-js', function() {
    gulp.watch(jsSource, ['build-js']);
});

gulp.task('build-html', function () {
    return gulp.src(htmlSource, { base: './' })
        .pipe(gulp.dest(destDir));
});

gulp.task('watch-html', function() {
    gulp.watch(htmlSource, ['build-html']);
});

gulp.task('copy-assets', function() {
    return gulp.src(assetsSource, { base: './'})
        .pipe(gulp.dest(destDir));
});

gulp.task('watch-assets', function() {
    gulp.watch(assetsSource, ['copy-assets']);
});

gulp.task('build', ['build-css', 'build-js', 'build-html', 'copy-assets']);

gulp.task('watch', ['watch-css', 'watch-js', 'watch-html', 'watch-assets']);

// Deploy target to use to deploy to github pages (not used -> no SEO solution, heroku is used instead)
gulp.task('deploy', function () {
    runSequence('build', function() {
        deployOptions.push = argv.push ? true : false;
        return gulp.src(['./dist/**/*'])
            .pipe(deploy(deployOptions));
    })
});