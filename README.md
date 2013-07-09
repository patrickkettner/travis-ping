# travis-ping
### manually ping travis-ci to restart the last build.

Useful if an external dependency (like a plugin/module, server, or service) was down
when the test originally ran, or if your testing target changes over time (like a 
web scraper).


#### requirements

- Your travis-ci token (you can find it on [your travis profile](https://travis-ci.org/profile))
- A repo that has testing enabled and at least one test previously ran


Use it as a node module

```javascript
  var travisPing = require('travis-ping');
  travisPing.ping('h$RWfBJietLaZXSBr2byv3', 'patrickkettner/travis-ping', function(value) { 
    console.log(value)
  })
```
or as a command line tool

```shell
  travis-ping h$RWfBJietLaZXSBr2byv3 patrickkettner/travis-ping
```
