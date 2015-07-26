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
  travisPing.ping(
    {username: 'patrickkettner', password: 'mYr33lP4$5w0rd101jk'}, // Credentials
    'patrickkettner/travis-ping',                                  // Repository
    {branch: 'master'},                                            // Filter
    function(travisResponse) {                                     // Callback
      console.log(travisResponse)
    }
  )
```
### or as a command line tool

```shell
  travis-ping patrickkettner/travis-ping [options]
```

## Credentials

When run from the commandline, you are asked for your username and credentials.

Alternatively you may supply a [GitHub personal access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)
with `--token [token]` and use the tool without interaction. When using as a module
set `{github_token: token}` instead of the username and password;

To connect to the Pro API ([travis-ci.com](http://travis-ci.com)), use the `--pro`
option. As module, add `pro: true` to the credentials;

## Filter

You can filter on a branch using `--branch [branch]` to restart the last build of
a specific branch. As module, use `{branch: branch}` as filter.

Use `--push` to restart a build for a push event, excluding builds for pull
requests. The `--pull-request` option will do the oposite. As module, set
`{eventType: 'push'}` or `{eventType: 'pull_request'}` as filter.

