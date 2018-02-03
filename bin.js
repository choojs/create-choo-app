#!/usr/bin/env node

var mapLimit = require('async-collection/map-limit')
var series = require('async-collection/series')
var ansi = require('ansi-escape-sequences')
var minimist = require('minimist')
var dedent = require('dedent')
var rimraf = require('rimraf')
var path = require('path')

var lib = require('./')

var TRAIN = '🚂🚋🚋'

var USAGE = `
  $ ${clr('create-choo-app', 'bold')} ${clr('<project-directory>', 'green')} [options]

  Options:

    -h, --help        print usage
    -v, --version     print version
    -q, --quiet       don't output any logs

  Examples:

    Create a new Choo application
    ${clr('$ create-choo-app', 'cyan')}

  Running into trouble? Feel free to file an issue:
  ${clr('https://github.com/choojs/create-choo-app/issues/new', 'cyan')}

  Do you enjoy using this software? Become a backer:
  ${clr('https://opencollective.com/choo', 'cyan')}
`.replace(/\n$/, '').replace(/^\n/, '')

var NODIR = `
  Please specify the project directory:
    ${clr('$ create-choo-app', 'cyan')} ${clr('<project-directory>', 'green')}

  For example:
    ${clr('$ create-choo-app', 'cyan')} ${clr('my-choo-app', 'green')}

  Run ${clr('create-choo-app --help', 'cyan')} to see all options.
`.replace(/\n$/, '').replace(/^\n/, '')

var argv = minimist(process.argv.slice(2), {
  alias: {
    help: 'h',
    quiet: 'q',
    version: 'v'
  },
  boolean: [
    'help',
    'quiet',
    'version'
  ]
})

;(function main (argv) {
  var dir = argv._[0]

  if (argv.help) {
    console.log(USAGE)
  } else if (argv.version) {
    console.log(require('./package.json').version)
  } else if (!dir) {
    console.log(NODIR)
    process.exit(1)
  } else {
    create(path.join(process.cwd(), dir), argv)
  }
})(argv)

function create (dir, argv) {
  var written = []
  var cmds = [
    function (done) {
      print('Creating a new Choo app in ' + clr(dir, 'green') + '.\n')
      lib.mkdir(dir, done)
    },
    function (done) {
      var filename = 'package.json'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writePackage(dir, done)
    },
    function (done) {
      print('\nInstalling packages, this might take a couple of minutes.')
      written.push(path.join(dir, 'node_modules'))
      var pkgs = [
        'choo',
        'choo-devtools',
        'choo-service-worker',
        'sheetify',
        'tachyons'
      ]
      var msg = clrInstall(pkgs)
      print('Installing ' + msg + '…')
      lib.install(dir, pkgs, done)
    },
    function (done) {
      var pkgs = [
        'bankai',
        'choo-scaffold',
        'dependency-check',
        'standard'
      ]
      var msg = clrInstall(pkgs)
      print('Installing ' + msg + '…')
      lib.devInstall(dir, pkgs, done)
    },
    function (done) {
      print('')
      var filename = '.gitignore'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeIgnore(dir, done)
    },
    function (done) {
      var filename = 'README.md'
      var description = 'A very cute app'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeReadme(dir, description, done)
    },
    function (done) {
      var filename = 'index.js'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeIndex(dir, done)
    },
    function (done) {
      var filename = 'stores/clicks.js'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeStore(dir, done)
    },
    function (done) {
      var filename = 'sw.js'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeServiceWorker(dir, done)
    },
    function (done) {
      var filename = 'views/main.js'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeMainView(dir, done)
    },
    function (done) {
      var filename = 'views/404.js'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeNotFoundView(dir, done)
    },
    function (done) {
      var filename = 'manifest.json'
      var description = 'A very cute app'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeManifest(dir, description, done)
    },
    function (done) {
      var filename = 'assets/icon.png'
      printFile(filename)
      written.push(path.join(dir, filename))
      lib.writeIcon(dir, done)
    },
    function (done) {
      var message = '.'
      print('\nInitializing ' + clr('git', 'cyan'))
      written.push(path.join(dir, '.git'))
      lib.createGit(dir, message, done)
    }
  ]

  series(cmds, function (err) {
    if (err) {
      print('\nAborting installation. The following error occured:')
      print('  ' + clr(err.message, 'red') + '\n')
      mapLimit(written, 1, cleanFile, function (err) {
        if (err) throw err
        console.log('Cleanup completed, please try again sometime.')
        process.exit(1)
      })
    } else {
      var msg = dedent`
        App created in ${clr(dir, 'green')}.
        ${clr('All done, good job!', 'magenta')} ${TRAIN}

        The following commands are available:
          ${clr('npm start', 'cyan')}        Start the development server
          ${clr('npm test', 'cyan')}         Lint, validate deps & run tests
          ${clr('npm run build', 'cyan')}    Compile all files to ${clr('dist/', 'green')}
          ${clr('npm run inspect', 'cyan')}  Inspect the bundle dependencies

        Do you enjoy using this software? Become a backer:
        ${clr('https://opencollective.com/choo', 'cyan')}
      `.replace(/\n$/g, '')
      print('\n' + msg)
    }
  })

  function print (val) {
    if (!argv.quiet) console.log(val)
  }

  function printFile (filename) {
    print('Creating file ' + clr(filename, 'cyan') + '…')
  }
}

function clr (text, color) {
  return process.stdout.isTTY ? ansi.format(text, color) : text
}

function clrInstall (pkgs) {
  return pkgs.reduce(function (str, pkg, i) {
    pkg = clr(pkg, 'cyan')
    if (i === pkgs.length - 1) {
      return str + pkg
    } else if (i === pkgs.length - 2) {
      return str + pkg + ', and '
    } else {
      return str + pkg + ', '
    }
  }, '')
}

function cleanFile (file, cb) {
  console.log('Deleting generated file… ' + clr(path.basename(file), 'cyan'))
  rimraf(file, cb)
}
