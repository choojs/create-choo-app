var exec = require('child_process').exec
var dedent = require('dedent')
var mkdirp = require('mkdirp')
var path = require('path')
var pump = require('pump')
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
  var file = dedent`
  {
    "name": "${name}",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "build": "bankai build index.js",
      "create": "choo-scaffold",
      "inspect": "bankai inspect index.js",
      "start": "bankai start index.js",
      "test": "standard && npm run test-deps",
      "test-deps": "dependency-check . && dependency-check . --extra --no-dev -i tachyons"
    }
  }
  `
  write(filename, file, cb)
}

exports.writeIgnore = function (dir, cb) {
  var filename = path.join(dir, '.gitignore')
  var file = dedent`
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

exports.writeReadme = function (dir, description, cb) {
  var filename = path.join(dir, 'README.md')
  var name = path.basename(dir)
  var file = dedent`
    # ${name}
    ${description}

    ## Commands
    Command                | Description                                      |
    -----------------------|--------------------------------------------------|
    \`$ npm start\`          | Start the development server
    \`$ npm test\`           | Lint, validate deps & run tests
    \`$ npm run build\`      | Compile all files into \`dist/\`
    \`$ npm run create\`     | Generate a scaffold file
    \`$ npm run inspect\`    | Inspect the bundle's dependencies
  `

  write(filename, file, cb)
}

exports.writeIndex = function (dir, cb) {
  var filename = path.join(dir, 'index.js')
  var file = dedent`
    var css = require('sheetify')
    var choo = require('choo')

    css('tachyons')

    var app = choo()
    if (process.env.NODE_ENV !== 'production') {
      app.use(require('choo-devtools')())
    } else {
      app.use(require('choo-service-worker')())
    }

    app.use(require('./stores/clicks'))

    app.route('/', require('./views/main'))
    app.route('/*', require('./views/404'))

    module.exports = app.mount('body')\n
  `

  write(filename, file, cb)
}

exports.writeServiceWorker = function (dir, cb) {
  var filename = path.join(dir, 'sw.js')
  var file = dedent`
    /* global self */

    var VERSION = require('./package.json').version
    var URLS = process.env.FILE_LIST

    // Respond with cached resources
    self.addEventListener('fetch', function (e) {
      e.respondWith(self.caches.match(e.request).then(function (request) {
        if (request) return request
        else return self.fetch(e.request)
      }))
    })

    // Register worker
    self.addEventListener('install', function (e) {
      e.waitUntil(self.caches.open(VERSION).then(function (cache) {
        return cache.addAll(URLS)
      }))
    })

    // Remove outdated resources
    self.addEventListener('activate', function (e) {
      e.waitUntil(self.caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key, i) {
          if (keyList[i] !== VERSION) return self.caches.delete(keyList[i])
        }))
      }))
    })\n
  `

  write(filename, file, cb)
}

exports.writeManifest = function (dir, description, cb) {
  var filename = path.join(dir, 'manifest.json')
  var name = path.basename(dir)
  var file = dedent`
    {
      "name": "${name}",
      "short_name": "${name}",
      "description": "${description}",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#000",
      "theme_color": "#000",
      "icons": [{
        "src": "/assets/icon.png",
        "type": "image/png",
        "sizes": "512x512"
      }]
    }
  `

  write(filename, file, cb)
}

exports.writeNotFoundView = function (dir, cb) {
  var dirname = path.join(dir, 'views')
  var filename = path.join(dirname, '404.js')
  var projectname = path.basename(dir)
  var file = dedent`
    var html = require('choo/html')

    var TITLE = '${projectname} - route not found'

    module.exports = view

    function view (state, emit) {
      if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)
      return html\`
        <body class="sans-serif pa3">
          <h1>Route not found.</h1>
          <a class="pt2" href="/">Back to main.</a>
        </body>
      \`
    }\n
  `

  mkdirp(dirname, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dirname))
    write(filename, file, cb)
  })
}

exports.writeMainView = function (dir, cb) {
  var dirname = path.join(dir, 'views')
  var filename = path.join(dirname, 'main.js')
  var projectname = path.basename(dir)
  var file = dedent`
    var html = require('choo/html')

    var TITLE = '${projectname} - main'

    module.exports = view

    function view (state, emit) {
      if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

      return html\`
        <body class="code lh-copy">
          <main class="pa3 cf center">
            <section class="fl mw6 w-50-m w-third-l pa3">
              <h2>1.</h2>
              <p>
                Welcome to your new Choo application.
                We're very happy you've made it this far.
              </p>

              <p>
                You're now in control of your own Choo app. The moment you decide to
                deploy it, it'll work offline and on any device.
              </p>

              <br>
            </section>

            <section class="fl mw6 w-50-m w-third-l pa3">
              <h2>2.</h2>

              <p>
                We've outfitted your project with a small selection of commands to
                help you achieve results faster:
              </p>

              <ul>
                <li class="mb3">
                  <strong>npm start</strong><br>
                  start your project for local development.
                </li>
                <li class="mb3">
                  <strong>npm run build</strong><br>
                  compile your project for production.
                </li>
                <li class="mb3">
                  <strong>npm run inspect</strong><br>
                  visualize your project's dependencies.
                </li>
                <li class="mb3">
                  <strong>npm run create</strong><br>
                  scaffold a new file.
                </li>
              </ul>

              <br>
            </section>

            <section class="fl mw6 w-50-m w-third-l pa3">
              <h2>3.</h2>

              <p>
                Your project also comes with a few directories. These names have
                special meanings for the build tool, so it's good to know what they
                do.
              </p>

              <ul>
                <li class="mb3">
                  <strong>assets/</strong><br>
                  Static files that can be served up, such as images and fonts.
                </li>
                <li class="mb3">
                  <strong>components/</strong><br>
                  Reusable fragments that can be composed into views.
                </li>
                <li class="mb3">
                  <strong>stores/</strong><br>
                  Pieces of logic that are shared by multiple components.
                </li>
                <li class="mb3">
                  <strong>views/</strong><br>
                  Combinations of components that are mapped to routes.
                </li>
              </ul>

              <br>
            </section>

            <section class="fl mw6 w-50-m w-third-l pa3">
              <h2>4.</h2>

              <p>
                So far we've provided you with one base view, <a
                href="/oh-no">one fallback view</a>, and one store. This serves
                as an example. A place to start from. It's your project now, so
                go ahead and delete them once you know how they work.
              </p>

              <p>Number of clicks stored: \${state.totalClicks}</p>

              <button class="dim ph3 ba bw1 pv2 b--black pointer bg-white"
                onclick=\${handleClick}>
                Emit a click event
              </button>

              <br><br>
            </section>

            <section class="fl mw6 w-50-m w-third-l pa3">
              <h2>5.</h2>

              <p>
                To make your development journey more pleasant, we've also
                included <a
                href="https://github.com/choojs/choo-devtools">devtools</a>. If
                you open your browser console, here's a selection of the
                commands that are at your disposal:

                <ul>
                  <li class="mb3">
                    <strong>choo.state</strong><br>
                    Log the current application state.
                  </li>
                  <li class="mb3">
                    <strong>choo.log</strong><br>
                    Log the last 150 events received by the event bus.
                  </li>
                  <li class="mb3">
                    <strong>choo.emit</strong><br>
                    Emit an event inside the application event bus.
                  </li>
                  <li class="mb3">
                    <strong>choo.help</strong><br>
                    See an overview of all available commands.
                  </li>
                </ul>
              </p>
            </section>

            <section class="fl mw6 w-50-m w-third-l pa3">
              <h2>6.</h2>

              <p>
                And that's about it! Thanks for reading. If you have any
                questions, check out the <a  href="https://choo.io">docs</a> or reach
                out on <a href="https://github.com/choojs/choo">GitHub</a> or <a
                href="https://www.irccloud.com/irc/freenode/channel/choo">IRC</a>.
                We're online everyday, and always around to help. Happy hacking!
              </p>
            </section>
          </main>
        </body>
      \`

      function handleClick () {
        emit('clicks:add', 1)
      }
    }\n
  `
  file = file.replace(/\\\$/g, '$')

  mkdirp(dirname, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dirname))
    write(filename, file, cb)
  })
}

exports.writeIcon = function (dir, cb) {
  var iconPath = path.join(__dirname, 'assets/icon.png')
  var dirname = path.join(dir, 'assets')
  var filename = path.join(dirname, 'icon.png')
  mkdirp(dirname, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dirname))
    var source = fs.createReadStream(iconPath)
    var sink = fs.createWriteStream(filename)
    pump(source, sink, function (err) {
      if (err) return cb(new Error('Could not write file ' + filename))
      cb()
    })
  })
}

exports.writeStore = function (dir, cb) {
  var filename = path.join(dir, 'stores/clicks.js')
  var file = dedent`
    module.exports = store

    function store (state, emitter) {
      state.totalClicks = 0

      emitter.on('DOMContentLoaded', function () {
        emitter.on('clicks:add', function (count) {
          state.totalClicks += count
          emitter.emit(state.events.RENDER)
        })
      })
    }\n
  `

  mkdirp(path.dirname(filename), function (err) {
    if (err) return cb(err)
    write(filename, file, cb)
  })
}

exports.install = function (dir, packages, cb) {
  packages = packages.join(' ')
  var cmd = 'npm install --save --loglevel error ' + packages
  var popd = pushd(dir)
  exec(cmd, {env: process.env}, function (err) {
    if (err) return cb(new Error(cmd))
    popd()
    cb()
  })
}

exports.devInstall = function (dir, packages, cb) {
  packages = packages.join(' ')
  var cmd = 'npm install --save-dev --loglevel error ' + packages
  var popd = pushd(dir)
  exec(cmd, {env: process.env}, function (err) {
    if (err) return cb(new Error(cmd))
    popd()
    cb()
  })
}

exports.createGit = function (dir, message, cb) {
  var init = 'git init'
  var add = 'git add -A'
  var config = 'git config user.email'
  var commit = 'git commit -m "' + message + '"'

  var popd = pushd(dir)
  exec(init, function (err) {
    if (err) return cb(new Error(init))

    exec(add, function (err) {
      if (err) return cb(new Error(add))

      exec(config, function (err) {
        if (err) return cb(new Error(config))

        exec(commit, function (err) {
          if (err) return cb(new Error(commit))
          popd()
          cb()
        })
      })
    })
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
  fs.writeFile(filename, file, function (err) {
    if (err) return cb(new Error('Could not write file ' + filename))
    cb()
  })
}
