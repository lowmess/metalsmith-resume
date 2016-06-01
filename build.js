var Metalsmith = require('metalsmith')
var permalinks = require('metalsmith-permalinks')
// HTML
var layouts = require('metalsmith-layouts')
var markdown = require('metalsmith-markdownit')
var collections = require('metalsmith-collections')
// CSS
var sass = require('metalsmith-sass')
var prefix = require('metalsmith-autoprefixer')
var bourbon = require('node-bourbon').includePaths

Metalsmith(__dirname)
  .source('source')
  .destination('_build')
  .metadata({
    site: {
      title: 'Resume',
      description: 'I am a human person and this is my resume.'
    }
  })
  // CSS
  .use(sass({
    includePaths: bourbon,
    outputStyle: 'compressed',
    outputDir: 'css/'
  }))
  .use(prefix())
  // HTML
  .use(collections({
    education: {
      pattern: 'education/**/*.md',
      sortBy: 'startDate',
      reverse: true
    },
    work: {
      pattern: 'work/**/*.md',
      sortBy: 'startDate',
      reverse: true
    },
    pages: {
      pattern: '*.md'
    }
  }))
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
    moment: require('moment'),
    pretty: true,
    directory: 'templates',
    default: 'default.pug',
    pattern: '**/*.html'
  }))
  .build(function (err) {
    if (err) throw err
  })
