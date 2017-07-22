var exec = require('child_process').exec
var mkdirp = require('mkdirp')
var path = require('path')
var fs = require('fs')

exports.mkdir = function (dir, cb) {
  mkdirp(dir, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dir))
    fs.readdir(dir, function (err, files) {
      if (err) return cb(new Error('Could not read directory ' + dir))
      if (files.length) return cb(new Error('Directory contains files. This might create conflicts.'))
      cb()
    })
  })
}

exports.writePackage = function (dir, cb) {
  var filename = path.join(dir, 'package.json')
  var name = path.basename(dir)
  var file = `
  {
    "name": "${name}",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "build": "bankai build index.js",
      "inspect": "bankai inspect index.js",
      "start": "bankai start index.js",
      "test": "standard && test-deps",
      "test-deps": "dependency-check . && dependency-check . --extra --no-dev -i tachyons"
    }
  }
  `
  write(filename, file, cb)
}

exports.writeIgnore = function (dir, cb) {
  var filename = path.join(dir, '.gitignore')
  var file = `
    node_modules/
    .nyc_output/
    coverage/
    dist/
    tmp/
    npm-debug.log*
    .DS_Store
  `

  write(filename, file, cb)
}

exports.writeReadme = function (dir, cb) {
  var filename = path.join(dir, 'README.md')
  var name = path.basename(dir)
  var file = `
    # ${name}
    A choo application

    ## Routes
    Route              | Description           |
    -------------------|-----------------------|
    \`/\`              | The main view
    \`/*\`             | Display unhandled routes

    ## Commands
    Command            | Description           |
    -------------------|-----------------------|
    $ npm install      | Install all dependencies
    $ npm start        | Start the development server
    $ npm run build    | Compile all files into dist/
    $ npm run inspect  | Inspect the bundle's dependencies
  `

  write(filename, file, cb)
}

exports.writeIndex = function (dir, cb) {
  var filename = path.join(dir, 'index.js')
  var file = `
    var css = require('sheetify')
    var choo = require('choo')

    css('tachyons')

    var app = choo()
    if (process.env.NODE_ENV !== 'production') {
      app.use(require('choo-expose')())
      app.use(require('choo-log')())
    }

    app.route('/', require('./views/main'))
    app.route('/*', require('./views/404'))

    if (!module.parent) app.mount('body')
    else module.exports = app
  `

  write(filename, file, cb)
}

exports.install = function (dir, packages, cb) {
  packages = packages.join(' ')
  var cmd = 'npm install --save --cache-min Infinity --loglevel error ' + packages
  var popd = pushd(dir)
  exec(cmd, function (err) {
    if (err) return cb(new Error(cmd))
    popd()
    cb()
  })
}

exports.devInstall = function (dir, packages, cb) {
  packages = packages.join(' ')
  var cmd = 'npm install --save-dev --cache-min Infinity --loglevel error ' + packages
  var popd = pushd(dir)
  exec(cmd, function (err) {
    if (err) return cb(new Error(cmd))
    popd()
    cb()
  })
}

function pushd (dir) {
  var prev = process.cwd()
  process.chdir(dir)
  return function popd () {
    process.chdir(prev)
  }
}

function write (filename, file, cb) {
  file = file.replace(/\n {2}/, '')
  fs.writeFile(filename, file, function (err) {
    if (err) return cb(new Error('Could not write file ' + filename))
    cb()
  })
}
