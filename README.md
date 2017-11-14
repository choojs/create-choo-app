# create-choo-app [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Create a fresh choo application. Because starting a new project should take
minutes, not days.

## Usage
```sh
$ npx create-choo-app <project-directory>
```

## Dependencies
`create-choo-app` installs the following dependencies:

Name                                                                 | Dependency Type | Description |
---------------------------------------------------------------------|-----------------|-------------|
[choo](https://github.com/choojs/choo)                               | Production      | Fast, 4kb framework.
[choo-service-worker](https://github.com/choojs/choo-service-worker) | Production      | Offline support for Choo.
[sheetify](https://github.com/stackcss/sheetify/)                    | Production      | Hyper performant CSS-in-JS.
[tachyons](http://tachyons.io/)                                      | Production      | A minimalist CSS toolkit.
[bankai](https://github.com/choojs/bankai)                           | Development     | An asset bundler and static file server.
[choo-devtools](https://github.com/choojs/choo-devtools)             | Development     | Debug Choo applications.
[choo-scaffold](https://github.com/choojs/choo-scaffold)             | Development     | Generate new application files.
[dependency-check](https://github.com/maxogden/dependency-check)     | Development     | Verify project dependencies.
[standard](https://standardjs.com/)                                  | Development     | Statically check JavaScript files for errors.

## API
```txt
  $ create-choo-app <project-directory> [options]

  Options:

    -h, --help        print usage
    -v, --version     print version
    -q, --quiet       don't output any logs

  Examples:

    Create a new Choo application
    $ create-choo-app

  Running into trouble? Feel free to file an issue:
  https://github.com/choojs/create-choo-app/issues/new

  Do you enjoy using this software? Become a backer:
  https://opencollective.com/choo
```

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/create-choo-app.svg?style=flat-square
[3]: https://npmjs.org/package/create-choo-app
[4]: https://img.shields.io/travis/choojs/create-choo-app/master.svg?style=flat-square
[5]: https://travis-ci.org/choojs/create-choo-app
[6]: https://img.shields.io/codecov/c/github/choojs/create-choo-app/master.svg?style=flat-square
[7]: https://codecov.io/github/choojs/create-choo-app
[8]: http://img.shields.io/npm/dm/create-choo-app.svg?style=flat-square
[9]: https://npmjs.org/package/create-choo-app
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
