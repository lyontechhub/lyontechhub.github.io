var gulp = require('gulp');
var fsExtra = require('fs-extra')
var less = require("gulp-less");
var yargs = require('yargs/yargs');
var {hideBin} = require('yargs/helpers');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-clean-css');
var path = require('path');
var handlebars = require('handlebars');

var argv = yargs(hideBin(process.argv)).argv;

/* Configuration */
var sources = {
  css: ['css/main.less']
, js: ['js/**/*']
, handlebarTemplates: ['templates/communityEvents.html']
, imgs: ['imgs/**/*']
, pages: ['data/*.json', 'templates/*.html']
};
var destDir = 'public/';

/* Tasks */
exports.clean = async () =>
  fsExtra.removeSync('public');

exports.buildCss = () =>
  gulp.src(sources.css)
    .pipe(less({ paths: ['node_modules/bootstrap/less/'] }))
    .pipe(gulpIf(argv.push, minifyCSS()))
    .pipe(gulp.dest(destDir + 'css/'));

exports.watchCss = () =>
  gulp.watch(sources.css, exports.buildCss);

exports.buildImgs = () =>
  gulp.src(sources.imgs)
    .pipe(gulp.dest(destDir + 'imgs/'));

exports.watchImgs = () =>
  gulp.watch(sources.imgs, exports.buildImgs);

exports.buildJs = () =>
  gulp.src(sources.js)
    .pipe(gulp.dest(destDir + 'js/'));

exports.watchJs = () =>
  gulp.watch(sources.js, exports.buildJs);

exports.buildHandlebarTemplates = () => 
  gulp.src('templates/communityEvents.html')
    .pipe(gulp.dest(destDir + 'js/'));

exports.watchHandlebarTemplates = () =>
  gulp.watch(sources.handlebarTemplates, exports.buildHandlebarTemplates);

exports.buildPages = async () => {
  const withTemplate = (src) => handlebars.compile(fsExtra.readFileSync('templates/' + src, 'utf8'));
  const baseOf = withTemplate("baseof.html");
  const withBody = (target, body) => {
    const dest = 'public/' + target;
    fsExtra.ensureDirSync(path.dirname(dest));
    fsExtra.writeFileSync(dest, baseOf({content: body}));
  };
  const page = (src, target, args) => withBody(target, withTemplate(src)(args));
  const defaultImage = (x) => {
    if (!x.image) {
        x.image = x.key + ".png";
    }
    return x;
  };
  const addDetailKey = (x) => {
    x.detailKey = x.key.replaceAll(' ', '-');
    return x;
  };
  const communities =
    fsExtra
      .readJsonSync('data/communities.json')
      .map(defaultImage)
      .map(addDetailKey)
    ;
  const keyedCommunities =
    communities
      .reduce((map, obj) => {
        map[obj.key] = obj;
        return map;
    }, {})
  const detailsData = (communityKey) => {
    const detailsFilename = 'data/' + communityKey + '.json';
    if (fsExtra.pathExistsSync(detailsFilename))
      return defaultImage(fsExtra.readJsonSync(detailsFilename));
    else {
      console.warn('Community file is missing: ' + detailsFilename);
      return {};
    }
  };

  page('index.html', 'index.html', {});
  page('about.html', 'about/index.html', {});
  page('calendar.html', 'calendar/index.html', {});
  page('conferences.html', 'conferences/index.html', {
    conferences:
      fsExtra
        .readJsonSync('data/conferences.json')
        .map(defaultImage)
  });
  page('communities.html', 'communities/index.html', {
    communities:
      communities
        .toSorted((x, y) => x.name.localeCompare(y.name))
  });
  communities.forEach((community) => {
    const data = {
      ...detailsData(community.key),
      ...keyedCommunities[community.key]
    };
    data.patternsGoogleCalendar = JSON.stringify(data.patternsGoogleCalendar || [community.key]);
    page('community.html', 'community/' + community.detailKey + '/index.html', data);
  });
  await Promise.resolve('ignored');
};

exports.watchPages = () =>
  gulp.watch(sources.pages, exports.buildPages);

exports.build =
  gulp.parallel(exports.buildCss, exports.buildImgs, exports.buildJs, exports.buildHandlebarTemplates, exports.buildPages);

exports.watch =
  gulp.parallel(exports.watchCss, exports.watchImgs, exports.watchJs, exports.watchHandlebarTemplates, exports.watchPages);

exports.dev =
  gulp.series(exports.build, exports.watch);
