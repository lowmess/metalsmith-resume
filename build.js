var Metalsmith = require('metalsmith')
var permalinks = require('metalsmith-permalinks')
var metadata = require('metalsmith-metadata')
var collections = require('metalsmith-collections')
var drafts = require('metalsmith-drafts')
var defaults = require('metalsmith-default-values')
var markdown = require('metalsmith-markdownit')
var layouts = require('metalsmith-layouts')
var minify = require('metalsmith-html-minifier')

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
  .use(defaults([{
    pattern: '*/**/*.md',
    defaults: {
      draft: true
    }
  }]))
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
    contrast: require('get-contrast'),
    directory: 'templates',
    default: 'default.pug',
    pattern: '**/*.html'
  }))
  .use(drafts())

if (process.env.NODE_ENV == 'production') {
  siteBuild.use(minify())
}

siteBuild.build(function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('Site build complete!')
  }
})
