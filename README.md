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
* And a pull request to update web site (logo & JSON).

Contribute
----------
Contact us on the Google Group, make pull-request, this web site must be managed by Lyon communities themselves.

Developers
----------
This web site is done with plain HTML/CSS3/Javascript and AngularJS.

*TODO* It is built upon Bootstrap, with LESS files for theme customisation.

AngularJS is used to organize code in views sharing a common layout and to adapt content according request result on JSON files stores in data directory.

Index.html file is the main entry point that define AngularJS application. Each view is then stored in views directory.

*TODO* The following JSON files are used to provide content to dynamic views :

* communities.json
* communities/[one per community].json

Packages are managed through NPM and Bower. So you need NodeJS but just for NPM.

*TODO* Gulp is used to build assets (CSS & JS) used by the site.

After cloning, just type the following commands to have a  :

```
npm install
node_modules\.bin\bower install
npm start
```

Nb : npm start is configured to start a local Node web server