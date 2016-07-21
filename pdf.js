var fs = require('fs')
var pdf = require('html-pdf')
var html = fs.readFileSync('./_build/index.html', 'utf8')
var options = {
    height: '11in',
    width: '8.5in',
    type: 'pdf',
    base: 'http://localhost:8008'
  }

var server = require('browser-sync').create()

server.init({
  server: './_build/',
  port: 8008,
  open: false,
  ui: false
})

pdf.create(html, options).toFile('./resume.pdf', function(err, res) {
  if (err) return console.log(err)
  console.log('PDF generation complete!\n' + res)
  server.exit()
  process.exit()
})
