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
        LinkedIn: '',
        GitHub: 'github.com/neo',
        Twitter: 'twitter.com/neo',
        Facebook: '',
        Codepen: '',
        Dribbble: '',
        Tumblr: '',
        reddit: '',
        Medium: ''
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
