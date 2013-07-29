# travis-ping
### manually ping travis-ci to restart the last build.

Useful if an external dependency (like a plugin/module, server, or service) was down
when the test originally ran, or if your testing target changes over time (like a▸
web scraper).


#### requirements

- A repo that has testing enabled and at least one test previously ran
- Your travis-ci token. There are a few ways to get this
  1. Use the [travis gem](https://github.com/travis-ci/travis#installation) and run ```travis token```
  2. Inspect the http headers in the travis web app.
      * Go to [travis.ci](https://travis-ci.org/profile), with your web tools open
      * Check the headers on the requests, some will have a 'Authorization' key, with
      a value of something along the lines of 'token RaNd0mHaSh_Dqaa'
      ![dev tools with Auth header](http://cl.ly/image/2b1S1r0q3H0Z/Untitled.png)

### Use it as a node module

```javascript
  var travisPing = require('travis-ping');
  travisPing.ping('h$RWfBJietLaZXSBr2byv3', 'patrickkettner/travis-ping', function(value) {▸
    console.log(value)
  })
```
### or as a command line tool

```shell
  travis-ping h$RWfBJietLaZXSBr2byv3 patrickkettner/travis-ping
```
