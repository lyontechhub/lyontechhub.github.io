Lyon Tech Hub Web Site
======================

Public url: http://www.lyontechhub.org/

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

* your community details in file data/[key used in list].json
* your community logo in imgs in PNG format with a 100x100 minimum resolution

Contribute
----------
Contact us on the Google Group, make pull-request, this web site must be managed by Lyon communities themselves.

Developers
----------
This web site is done with plain HTML/CSS3/Javascript.

The website is hosted through GitHub pages at lyontechhub.github.io as Organization pages (cf. https://help.github.com/articles/user-organization-and-project-pages).  
Note that GitHub uses master branch to deploy, that's why we have 'dev' branch as the default one, which contains source code, that is compiled through Gulp and pushed to master for deployment (see below).

### Source code

It is built upon Bootstrap, with LESS files for theme customisation (see Dev & build environment).

### JSON data & images

The following JSON files are used to provide content to dynamic views in 'data' directory:

* communities/[one per community].json

Images like community icons are in 'imgs' directory.

### Dev & build environment

After cloning, just type the following commands to have a  :

```
npm install
npm start
```

Nb : npm start is configured to start a local Node web server

Gulp is used to build assets (CSS & JS) and copy other assets (data & images) used by the site.

* 'build' task is used to build JS, CSS (from LESS) and HTML to 'public' directory ('npm start' launch 'build' task before running the local Node web server)
* 'watch' task is used to watch changes on source JS, LESS, HTML & assets files to trigger a build dynamically (never ending task)

### Deployment

Automatically deployed via github action
