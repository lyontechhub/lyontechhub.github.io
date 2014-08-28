Lyon Tech Hub Web Site
======================

This is the public web site that aggregates communication of group's communities.
It consists of the following sections :

* Home page
* Calendar page
* Communities page
* About

Join Us
-------
Send us a mail to lyonytechhub@googlegroups.com or even request to join the group, it is totally free.

If you have a tech/IT community in Lyon area, request to join Lyon Tech Hub to promote your exciting activity to the community, it is simple as :

* Request access to Google Calendar
* And submit a pull request to update web site (logo & JSON data).

Make sure you do a pull request on master branch including the following :

* your community in community list data/communities.json
* your community details in file data/[key used in list].json
* your community logo in imgs in PNG format with a 100x100 minimum resolution

Contribute
----------
Contact us on the Google Group, make pull-request, this web site must be managed by Lyon communities themselves.

Developers
----------
This web site is done with plain HTML/CSS3/Javascript and AngularJS.

The website is hosted through GitHub pages at lyontechhub.github.io as Organization pages (cf. https://help.github.com/articles/user-organization-and-project-pages).
Note that GitHub uses master branch to deploy, that's why we have 'dev' branch as the default one, which contains source code, that is compiled through Gulp and pushed to master for deployment (see below).

### Source code

It is built upon Bootstrap, with LESS files for theme customisation (see Dev & build environment).

AngularJS is used to organize code in views sharing a common layout and to adapt content according request result on JSON files stores in data directory.

Index.html file is the main entry point that define AngularJS application. Each view is then stored in views directory.

### JSON data & images

The following JSON files are used to provide content to dynamic views in 'data' directory:

* communities.json
* communities/[one per community].json

Images like community icons are in 'imgs' directory.

'imgs' & 'data' directories MUST be modified on 'master' branch ONLY to be put online. IT DOES NOT REQUIRE A BUILD to update.

You can also use --includeDevAssets to copy some files from dev branch in dist directory. BECAREFUL it will overide content from master branch with content from dev branch.

### Dev & build environment

Packages are managed through NPM and Bower. So you need NodeJS but just for NPM.

After cloning, just type the following commands to have a  :

```
npm install
node_modules\.bin\bower install
npm start
```

Nb : npm start is configured to start a local Node web server

Gulp is used to build assets (CSS & JS) used by the site. JSON & images are to be modified directly on master branch.

* 'build' task is used to build JS, CSS (from LESS) and HTML to 'dist' directory ('npm start' launch 'build' task before running the local Node web server)
* 'watch' task is used to watch changes on source JS, LESS & HTML files to trigger a build dynamically (never ending task)
* 'deploy' task is used to commit 'dist' directory content to 'master' branch (excluding 'data' & 'imgs' directories which are modified on 'master' branch directly), specify '--push' to effectively deploy on GitHub pages (i.e push on GitHub master branch)

So, to be well prepared for dev, launch 2 terminals, first one with 'npm start', and second one with 'node_modules\.bin\gulp watch'.

### SEO compliance

To be SEO compliant, we embed web site in a Node.js application only to use prerender.io. The application load the Node.js module for prerender.io, called the middleware.
It use Google AJAX crawling specification to make AngularJS application search engine compliant. See https://prerender.io/.

We use a heroku application for the prerender service, which crawl the web site with PhantomJS to return full old HTML. Prerender service is at http://mighty-waters-2486.herokuapp.com/.
It has been deployed with following instructions : https://github.com/prerender/prerender#deploying-your-own-on-heroku.
It has whitelist enabled with Lyon Tech Hub url only (config var : heroku config to list & heroku config:set to set).