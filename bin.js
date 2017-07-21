#!/usr/bin/env node

var ansi = require('ansi-escape-sequences')
var minimist = require('minimist')
var prompt = require('prompt')
var path = require('path')

var create = require('./')

var usage = `
  $ ${ansi.format('create-choo-app', 'bold')} ${ansi.format('<project-directory>', 'green')} [options]

  Options:

    -h, --help        print usage
    -v, --version     print version

  Examples:

    Create a new choo application
    ${ansi.format('$ create-choo-app', 'cyan')}

  Running into trouble? Feel free to file an issue:
  ${ansi.format('https://github.com/choojs/create-choo-app/issues/new', 'cyan')}

  Do you enjoy using this software? Become a backer:
  ${ansi.format('https://opencollective.org/choo', 'cyan')}
`.replace(/\n$/, '').replace(/^\n/, '')

var nodir = `
  Please specify the project directory:
    ${ansi.format('$ create-choo-app', 'cyan')} ${ansi.format('<project-directory>', 'green')}

  For example:
    ${ansi.format('$ create-choo-app', 'cyan')} ${ansi.format('my-choo-app', 'green')}

  Run ${ansi.format('create-choo-app --help', 'cyan')} to see all options.
`.replace(/\n$/, '').replace(/^\n/, '')

var argv = minimist(process.argv.slice(2), {
  alias: {
    help: 'h',
    version: 'v'
  }
})

;(function main (argv) {
  var dir = argv._[0]

  if (argv.help) {
    console.log(usage)
  } else if (argv.version) {
    console.log(require('../package.json').version)
  } else if (!dir) {
    console.log(nodir)
    process.exit(1)
  } else {
    dir = path.join(process.cwd(), dir)
    create(dir, argv, onError)
  }
})(argv)

function onError (err) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
}
