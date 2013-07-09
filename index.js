var concat = require('concat-stream');
var https = require('https');
var url = require('url');

var api = function(token, repo, host, data, cb) {
  var host = url.parse(host);
  var options = {
    'hostname': host.hostname,
    'path': host.path,
    'headers': {
      'Authorization': 'token ' + token,
    }
  };

  if (data) {
    data = JSON.stringify(data);
    options.headers['Content-Type'] = 'application/json; charset=UTF-8';
    options.headers['Content-Length'] = data.length;
    options.method = 'POST';
  }

  var req = https.request(options, function(res) {
    res.pipe(concat(cb));
  });

  if (data) req.write(data);

  req.end();

};

var lastBuild = function(token, repo, cb) {
  api(token, repo, 'https://api.travis-ci.org/repos/' + repo + '/builds', null, function(res) {
    try {
      cb(JSON.parse(res.toString())[0].id);
    }
    catch (e) {
      cb(res);
    }
  });
};

var travisPing = function(token, repo, cb) {
  lastBuild(token, repo, function(lastBuildId) {
    api(token, repo, 'https://api.travis-ci.org/requests', { 'build_id': lastBuildId }, function(res) {
      if (cb) cb(res.toString());
      });
  });
};

exports.ping = function(token, repo, cb) {
  if (!token || !repo) throw "You need to specify your travis-ci token and the repo you would like to rebuild (eg patrickkettner/travis-ping)";
  travisPing(token, repo, cb);
};

exports.interpret = function(args) {
  var token = args[2];
  var repo = args[3];
  travisPing(token, repo, function(res) {
   console.log(JSON.parse(res).flash[0]);
  });

  if (!token || !repo) {
  console.log('you need to specify a token and the repo you want to ping');
  process.exit(1);
  }
};

