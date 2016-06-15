var fs = require('fs')
var del = require('del')
// Metalsmith
var Metalsmith = require('metalsmith')
var permalinks = require('metalsmith-permalinks')
// HTML
var layouts = require('metalsmith-layouts')
var markdown = require('metalsmith-markdownit')
var collections = require('metalsmith-collections')
// CSS
var postcss = require('metalsmith-postcss')

var siteBuild = Metalsmith(__dirname)
  .source('source')
  .destination('_build')
  .metadata({
    global: {
      title: 'The Resume of Thomas A. Anderson (The One)',
      description: 'Prophesized by The Oracle to be The One, Thomas A. Anderson freed humanity from the Matrix and ended the Machine War.',
      theme: '#2ecc71'
    },
    person: {
      firstname: 'Thomas A.',
      lastname: 'Anderson',
      title: 'The One',
      site: 'http://matrix.wikia.com/wiki/Neo',
      sitename: 'Biography',
      email: 'neo@nebuchadnezzar.ship',
      phone: '(312) 555-0690',
      location: '???',
      social: {
        text: '@neo',
        url: 'twitter.com/neo'
      },
      proficiencies: [
        'Hacking',
        'Creative entrepeneurship',
        'Martial arts',
        'Negotiations',
        'Hovercraft piloting'
      ]
    }
  })
  // CSS
  .use(postcss({
    plugins: {
      'postcss-import': {},
      'postcss-nested': {},
      'postcss-custom-properties': {},
      'postcss-custom-media': {},
      'postcss-hexrgba': {},
      'autoprefixer': {
        browsers: ['last 2 versions', '> 5%']
      },
      'postcss-discard-comments': {}
    },
    map: {
      inline: false
    }
  }))
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
    // Rename CSS output file & delete unnecessary directories
    fs.rename('_build/stylesheets', '_build/css')
    del(['_build/css/**', '!_build/css', '!_build/css/main.css', '!_build/css/main.css.map'])

    console.log('Site build complete!')
  }
})
