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
    person: {
      firstname: 'Ahuman',
      lastname: 'Person',
      title: '100% Not a Robot',
      site: 'http://example.com',
      sitename: 'My Wesbite',
      email: 'human.person@example.com',
      phone: '(123) 456-7890',
      location: 'Earth'
    }
    site: {
      title: 'The Resume of a Human Person',
      description: 'I am a human person and this is my resume.',
      theme: '#2ecc71'
    },
    social: {
      LinkedIn: '',
      GitHub: '',
      Twitter: '@person',
      Facebook: '',
      Codepen: '',
      Dribbble: '',
      Tumblr: '',
      reddit: '',
      Medium: ''
    },
    proficiencies: [
      'breathing',
      'not being a robot',
      'drinking water to survive'
    ]
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
