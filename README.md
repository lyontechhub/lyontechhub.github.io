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
If you have a tech/IT community in Lyon area, request to add it to Lyon Tech Hub. Access to Google Calendar and a simple pull request to update web site is enough to promote your exciting activity to the community.

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