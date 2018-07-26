var util    = require('util'),
    exec    = require('child_process').exec,
    _       = require('lodash'),
    async   = require('async');


var people = {};

people.list = function(app, callback) {
  var command = util.format('heroku apps:info --app %s', app);
  var list = exec(command,
    function (error, stdout, stderr) {
      var collaborators = [];
      var info = stdout;
      var regex = /.*Collaborators:([\s\S]*?)(Dynos|Git URL)/i;

      var match = regex.exec(info);
      if (match) {
        collaborators = _.chain(match[1].split('\n'))
          .compact()
          .map(function(person) {
            return person.trim();
          })
          .value();
      }
      callback(collaborators);
    }
  );
}

people.remove = function(app, person, callback) {
  var command = util.format('heroku access:remove %s --app %s', person, app);
  var list = exec(command,
    function (error, stdout, stderr) {
      var found_and_removed = /done/i.test(stderr);
      return callback(found_and_removed);
    }
  );
}

people.add = function(app, person, callback) {
  var command = util.format('heroku access:add %s --app %s', person, app);
  var list = exec(command,
    function (error, stdout, stderr) {
      var added = /done/i.exec(stderr);
      return callback(added);
    }
  );
}

module.exports = people;
