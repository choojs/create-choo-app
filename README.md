# create-choo-app [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Create a fresh choo application. Because starting a new project should take
minutes, not days.

## Usage
```sh
$ npx create-choo-app <project-directory>
```

## ⚠️  HTTPS Instructions
When you first open up your application in a browser, you'll probably see a
warning page about HTTPS connections being untrusted. No worries, this is
entirely expected behavior. Follow the instructions below to solve this for
your browser.

<details>
  <summary>
    <b>How does this work?</b>
  </summary>
  For HTTPS to run on <code>localhost</code>, we must sign a TLS certificate
  locally. This is better known as a "self-signed certificate". Browsers
  actively check for certificates from unknown providers, and warn you (for good
  reason!) In our case, however, it's safe to ignore.

  HTTPS is needed for an increasing amount of APIs to work in the browser. For
  example if you want to test HTTP/2 connections or use parts of the storage
  API, you have no choice but to use an HTTPS connection on localhost. That's
  why we try and make this work as efficiently, and securely as possible.

  We generate a unique certificate for each Bankai installation at
  <code>~/.config/bankai</code>. This means that you'll only need to trust an
  HTTPS certificate for Bankai once. This should be secure from remote
  attackers, because unless they have successfully acquired access to your
  machine's filesystem, they won't be able to replicate the certificate.
</details>

<details>
  <summary>
    <b>Firefox Instructions</b>
  </summary>
  <h3>Step 1</h3>

  A wild security screen appears!. Click on "advanced".
  <img src="/assets/firefox01.png" alt="firefox01">

  <h3>Step 2</h3>
  More details emerge! Click on "Add Exception".
  <img src="/assets/firefox02.png" alt="firefox02">

  <h3>Step 3</h3>
  In the dropdown click "Confirm Security Exception".
  <img src="/assets/firefox03.png" alt="firefox03">

  <h3>Step 4</h3>
  Success!
  <img src="/assets/firefox04.png" alt="firefox04">
</details>

<details>
  <summary>
    <b>Chrome Instructions</b>
  </summary>
  Click the "more details" dropdown, then click "proceed".
  <img src="/assets/chrome01.png" alt="chrome01">
</details>

<details>
  <summary>
    <b>Safari Instructions</b>
  </summary>
  <h3>Step 1</h3>
  A wild security screen appears! Click "Show Certificate".
  <img src="/assets/safari01.png" alt="safari01">

  <h3>Step 2</h3>
  More details emerge! Check "Always trust 'localhost'…".
  <img src="/assets/safari02.png" alt="safari02">

  <h3>Step 3</h3>
  The box is checked! Click "Continue".
  <img src="/assets/safari03.png" alt="safari03">

  <h3>Step 4</h3>
  A box is asking you for your crendentials. Fill them in, and hit "Enter".

  <h3>Step 5</h3>
  Success!
  <img src="/assets/safari04.png" alt="safari04">
</details>

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
