var exec = require('child_process').exec
var dedent = require('dedent')
var mkdirp = require('mkdirp')
var path = require('path')
var pump = require('pump')
var fs = require('fs')

var TRAIN = '🚂🚋🚋'

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

exports.writeReadme = function (dir, cb) {
  var filename = path.join(dir, 'README.md')
  var name = path.basename(dir)
  var file = dedent`
    # ${name}
    A very cute app

    ## Routes
    Route              | File               | Description                     |
    -------------------|--------------------|---------------------------------|
    \`/\`              | \`views/main.js\`  | The main view
    \`/*\`             | \`views/404.js\`   | Display unhandled routes

    ## Commands
    Command                | Description                                      |
    -----------------------|--------------------------------------------------|
    \`$ npm start\`        | Start the development server
    \`$ npm test\`         | Lint, validate deps & run tests
    \`$ npm run build\`    | Compile all files into \`dist/\`
    \`$ npm run create\`   | Generate a scaffold file
    \`$ npm run inspect\`  | Inspect the bundle's dependencies
  `

  write(filename, file, cb)
}

exports.writeIndex = function (dir, cb) {
  var filename = path.join(dir, 'index.js')
  var file = dedent`
    var css = require('sheetify')
    var choo = require('choo')
    var store = require('./stores/clicks')

    css('tachyons')

    var app = choo()
    if (process.env.NODE_ENV !== 'production') {
      app.use(require('choo-devtools')())
    } else {
      // Enable once you want service workers support. At the moment you'll
      // need to insert the file names yourself & bump the dep version by hand.
      // app.use(require('choo-service-worker')())
    }

    app.use(store)

    app.route('/', require('./views/main'))
    app.route('/*', require('./views/404'))

    if (!module.parent) app.mount('body')
    else module.exports = app\n
  `

  write(filename, file, cb)
}

exports.writeServiceWorker = function (dir, cb) {
  var filename = path.join(dir, 'sw.js')
  var file = dedent`
    /* global self */

    var VERSION = String(Date.now())
    var URLS = [
      '/',
      '/bundle.css',
      '/bundle.js',
      'assets/icon.png'
    ]

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

exports.writeManifest = function (dir, cb) {
  var filename = path.join(dir, 'manifest.json')
  var name = path.basename(dir)
  var file = dedent`
    {
      "name": "${name}",
      "short_name": "${name}",
      "description": "A very cute app",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#ffc0cb",
      "theme_color": "#ffc0cb",
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
  var file = dedent`
    var html = require('choo/html')

    var TITLE = '${TRAIN} - route not found'

    module.exports = view

    function view (state, emit) {
      if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)
      return html\`
        <body class="sans-serif">
          <h1 class="f-headline pa3 pa4-ns">
            404 - route not found
          </h1>
          <a href="/" class="link black underline">
            Back to main
          </a>
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
  var file = dedent`
    var html = require('choo/html')

    var TITLE = '${TRAIN}'

    module.exports = view

    function view (state, emit) {
      if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

      return html\`
        <body class="sans-serif">
          <h1 class="f-headline pa3 pa4-ns">
            Choo choo!
          </h1>

          <div class="ph3 ph4-ns">
            <p>Current number of clicks: \${state.totalClicks}</p>

            <button class="f5 dim br-pill ph3 pv2 mb2 dib white bg-hot-pink bn pointer" onclick=\${handleClick}>Click Me!</button>
          </div>
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
