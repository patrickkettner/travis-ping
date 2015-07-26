var Travis = require('travis-ci');
var prompt = require('prompt');
prompt.message = '';
prompt.delimiter = '';

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

var travisPing = function(credentials, repo, cb) {
  var travis = new Travis({
    version: '2.0.0',
    pro: credentials.pro
  });

  delete credentials.pro;

  travis.authenticate(credentials, function (err, res) {
    if (err) {
      return cb(err);
    }
    travis.repos.builds({
      owner_name: repo.split('/')[0],
      name: repo.split('/')[1]
    }, function (err, res) {
      if (err) {
        return cb(err);
      }
      
      travis.requests({
        build_id: res.builds[0].id
      }, cb);
    });
  });
};

exports.ping = function(credentials, repo, cb) {
  if (!credentials || !repo) throw "You need to specify your github credentials and the repo you would like to rebuild (eg patrickkettner/travis-ping)";

  travisPing(credentials, repo, cb);
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
    
    travisPing(credentials, repo, function(err, res) {
      if (err) {
        console.warn(err);
        process.exit(1);
      }
      console.log(res.flash[0]);
    });
  };
  
  if (settings.token) {
    ping({github_token: settings.token});
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

