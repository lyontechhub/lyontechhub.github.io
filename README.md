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
It is totally free. Send us a mail at contact@lyontechhub.org, or [request access to our Slack](https://slack.lyontechhub.org).

If you have a tech/IT community in Lyon area, request to join Lyon Tech Hub to promote your exciting activity to the community, it is simple as :

* Request access to Google Calendar
* And submit a pull request to update web site (logo & JSON data).

Make sure you do a pull request on master branch including the following :

* your community details in file data/[key used in list].json
* your community logo in imgs in PNG or SVG format with a 100x100 minimum resolution to `/public/imgs/communities` directory.

Contribute
----------
Contact us on [Slack](https://slack.lyontechhub.org), at contact@lyontechhub.org, or submit a pull-request: this web site must be managed by Lyon communities themselves.

Developers
----------
This website is done with [Astro](https://astro.build/) framework, using TypeScript and plain HTML/CSS/JavaScript.

The website is hosted through GitHub pages at lyontechhub.github.io.
The branch `gh-pages` hosts the website.

### Source code

It is built upon [Astro](https://astro.build/) with TypeScript. Styles are written in plain CSS.

### JSON data & images

The following JSON files are used to provide content to dynamic views :

* data/[one per community].json

Images like community icons are in 'public/imgs/communities' directory.

* public/imgs/communities/[one per community].json

### Dev & build environment

After cloning, just type the following commands:

```
npm install
npm run dev
```

### Deployment

Automatically deployed via GitHub Actions
