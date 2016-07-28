var fs = require('fs')
// Metalsmith
var Metalsmith = require('metalsmith')
var permalinks = require('metalsmith-permalinks')
var metadata = require('metalsmith-metadata')
var collections = require('metalsmith-collections')
var drafts = require('metalsmith-drafts')
var defaults = require('metalsmith-default-values')
var markdown = require('metalsmith-markdownit')
var layouts = require('metalsmith-layouts')
var minify = require('metalsmith-html-minifier')
// PostCSS
var postcss = require('postcss')
// PDF
var pdf = require('html-pdf')

/* Metalsmith
 ******************************************************************************/

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

if (process.env.NODE_ENV === 'production') {
  siteBuild.use(minify())
}

siteBuild.build(function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('Metalsmith complete!\n')
    stylesheets()
    if (process.env.NODE_ENV === 'print') {
      print()
    }
  }
})

/* PostCSS
 ******************************************************************************/

function stylesheets () {
  var css = fs.readFileSync('css/main.css', 'utf-8')

  var plugins = [
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-custom-properties'),
    require('postcss-custom-media'),
    require('postcss-color-function'),
    require('postcss-focus'),
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 5%']
    })
  ]

  if (process.env.NODE_ENV === 'production') {
    plugins.push(
      require('postcss-uncss')({
        html: ['_build/**/*.html']
      }),
      require('css-mqpacker'),
      require('cssnano')
    )
  }

  postcss(plugins)
    .process(css, {
      from: 'css/main.css',
      to: '_build/css/main.css',
      map: { inline: false }
    })
    .then(function (result) {
      if (result.warnings()) {
        result.warnings().forEach(warn => {
          console.warn(warn.toString())
        })
      }
      fs.mkdirSync('_build/css')
      fs.writeFileSync('_build/css/main.css', result.css, 'utf-8')
      if (result.map) fs.writeFileSync('_build/css/main.css.map', result.map, 'utf-8')
      console.log('PostCSS Complete!\n')
    })
}

/* PDF
 ******************************************************************************/

function print () {
  var html = fs.readFileSync('_build/index.html', 'utf8')
  var options = {
    height: '11in',
    width: '8.5in',
    type: 'pdf',
    base: 'http://localhost:8008'
  }

  var server = require('browser-sync').create()

  server.init({
    server: '_build',
    port: 8008,
    open: false,
    ui: false
  })

  pdf.create(html, options).toFile('resume.pdf', function (err, res) {
    if (err) return console.log(err)
    server.exit()
    console.log('\nPDF generation complete!\n')
    process.exit()
  })
}
