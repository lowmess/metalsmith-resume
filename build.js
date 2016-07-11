// Metalsmith
var Metalsmith = require('metalsmith')
var permalinks = require('metalsmith-permalinks')
var metadata = require('metalsmith-metadata')
var collections = require('metalsmith-collections')
// HTML
var markdown = require('metalsmith-markdownit')
var layouts = require('metalsmith-layouts')

var siteBuild = Metalsmith(__dirname)
  .source('source')
  .destination('_build')
  .use(metadata({
    'site': 'site.yaml',
    'person': 'person.yaml'
  }))
  .use(collections({
    education: {
      pattern: 'education/**/*.md',
      sortBy: 'startDate',
      reverse: true
    },
    experience: {
      pattern: 'experience/**/*.md',
      sortBy: 'startDate',
      reverse: true
    },
    pages: {
      pattern: '*.md'
    }
  }))
  // HTML
  .use(markdown({
    html: true,
    xhtmlOut: true,
    typographer: true,
    linkify: true
  }))
  .use(permalinks({
    pattern: ':title',
    relative: false
  }))
  .use(layouts({
    engine: 'pug',
    pretty: true,
    moment: require('moment'),
    directory: 'templates',
    default: 'default.pug',
    pattern: '**/*.html'
  }))

siteBuild.build(function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('Site build complete!')
  }
})
