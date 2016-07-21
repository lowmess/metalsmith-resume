var fs = require('fs')
var postcss = require('postcss')

var css = fs.readFileSync('css/main.css', 'utf-8')

var plugins = [
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-custom-properties'),
    require('postcss-custom-media'),
    require('postcss-color-function'),
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 5%']
    })
  ]

if (process.env.NODE_ENV == 'production') {
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
    console.log('Styles processing complete!')
  })
