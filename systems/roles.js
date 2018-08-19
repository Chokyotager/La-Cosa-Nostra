// Enumerate roles
var fs = require("fs");

var ret = new Object();

// Read files [role]/[actions]/<name>
// Enumerate as [role]-<name>

var root = __dirname + "/../roles";

var roles = fs.readdirSync(root);

for (var i = 0; i < roles.length; i++) {
  if (fs.lstatSync(root + "/" + roles[i]).isDirectory() && fs.existsSync(root + "/" + roles[i] + "/actions")) {

    // List all actions
    var actions = fs.readdirSync(root + "/" + roles[i] + "/actions/");
    for (var j = 0; j < actions.length; j++) {
      if (actions[j].endsWith(".js")) {

        var key = roles[i] + "-" + actions[j].substring(0, actions[j].length - 3);
        ret[key] = require(root + "/" + roles[i] + "/actions/" + actions[j]);

      };
    };

  };
};

module.exports = ret;
