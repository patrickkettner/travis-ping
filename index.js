var Travis = require('travis-ci');
var prompt = require('prompt');
prompt.message = '';
prompt.delimiter = '';

var info = require('./package.json');

var getCredentials = function (cb) {
  prompt.start();
  prompt.get([{
    name: 'username',
    message: 'github username',
    required: true
  }, {
    name: 'password',
    message: 'github password',
    hidden: true
  }], cb);
};

var findBuild = function(travis, builds, commits, filter, cb) {
  var commitIndex = {};
  commits.forEach(function(commit) {
    commitIndex[commit.id] = commit;
  });

  for (var i = 0; i < builds.length; i++) {
    var build = builds[i];
    var commit = commitIndex[build.commit_id];
  
    if (filter.eventType && build.event_type !== filter.eventType) continue;
    if (filter.branch && commit.branch !== filter.branch) continue;
    
    return cb(null, build);
  }
  
  var type = (filter.eventType ? filter.eventType.replace('_', ' ') + ' ' : '');
  return cb('no ' + type + 'builds found for this ' + (filter.branch ? 'branch' : 'repo'));
};

var travisPing = function(credentials, repo, filter, cb) {
  var travis = new Travis({
    version: '2.0.0',
    pro: credentials.pro,
    headers: {
        'user-agent': 'TravisPing/' + info.version,
        'accept': 'application/vnd.travis-ci.2+json'
    }
  });

  delete credentials.pro;

  travis.authenticate(credentials, function (err, res) {
    if (err) {
      return cb(err);
    }
    
    travis.repos(repo.split('/')[0], repo.split('/')[1]).builds.get(function (err, res) {
      if (err) {
        return cb(err);
      }
      
      findBuild(travis, res.builds, res.commits, filter, function(err, build) {
        if (err) {
          return cb(err);
        }
        
        travis.builds(build.id).restart.post({}, function(err, res) {
          if (!err && !res.result) err = res.flash[0];
          cb(err, build);
        });
      });
    });
  });
};

exports.ping = function(credentials, repo, filter, cb) {
  if (!credentials || !repo) throw "You need to specify your github credentials and the repo you would like to rebuild (eg patrickkettner/travis-ping)";

  travisPing(credentials, repo, filter, cb);
};

exports.interpret = function(args, settings) {
  var repo = args[0];
  if (!repo) {
    console.warn('you need to specify the repo you want to ping');
    process.exit(1);
  }
  
  if (!settings) settings = {};

  var ping = function(credentials) {
    credentials.pro = settings.pro;
    
    filter = {};
    if (settings.branch) filter.branch = settings.branch; 
    if (settings.push && !settings.pullRequest) filter.eventType = 'push'; 
    if (settings.pullRequest && !settings.push) filter.eventType = 'pull_request'; 
    
    travisPing(credentials, repo, filter, function(err, build) {
      if (err) {
        console.warn(err);
        process.exit(1);
      }
      console.log('Successfully restarted build #' + build.number);
    });
  };
  
  var token = settings.token || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  
  if (token) {
    ping({github_token: token});
  } else {
    getCredentials(function (err, res) {
      if (err) {
        console.warn('request for github credentials failed');
        process.exit(1);
      }
      ping({username: res.username, password: res.password});
    });
  }
};

