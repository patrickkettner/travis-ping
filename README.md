# travis-ping
### manually ping travis-ci to restart the last build.

Useful if an external dependency (like a plugin/module, server, or service) was down
when the test originally ran, or if your testing target changes over time (like a▸
web scraper).


#### requirements

- A repo that has testing enabled and at least one test previously ran
- Github credentials for an account with access to the travis repo

### Use it as a node module

```javascript
  var travisPing = require('travis-ping');
  travisPing.ping('patrickkettner', ''mYr33lP4$5w0rd101jk, 'patrickkettner/travis-ping', function(travisResponse) {
    console.log(travisResponse)
  })
```
### or as a command line tool

```shell
  travis-ping patrickkettner/travis-ping
```
