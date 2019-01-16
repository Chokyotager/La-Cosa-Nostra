// Actionables are only from attributes and roles
// Re-written file

// Map as {(identifier): [function]}

var fs = require("fs");

var attributes = require("./attributes.js");
var roles = require("./roles.js");

var actionables = new Object();

for (role in roles) {

  var directory = roles[role].directory + "/actionables";
  var actions = cycle(directory);

  for (var i = 0; i < actions.length; i++) {

    var key = role + actions[i].substring(directory.length, actions[i].length - 3);
    actionables[key] = require(actions[i]);

  };

};

for (attribute in attributes) {

  var directory = attributes[attribute].directory + "/actionables";
  var actions = cycle(directory);

  for (var i = 0; i < actions.length; i++) {

    var key = "a/" + attribute + actions[i].substring(directory.length, actions[i].length - 3);
    actionables[key] = require(actions[i]);

  };

};

module.exports = actionables;

function cycle (directory, accept=".js") {

  if (!fs.existsSync(directory)) {
    return new Array();
  };

  var lists = fs.readdirSync(directory);
  var ret = new Array();

  lists = lists.map(x => directory + "/" + x);

  for (var i = 0; i < lists.length; i++) {

    // Recursively check
    if (fs.lstatSync(lists[i]).isDirectory()) {
      ret = ret.concat(cycle(lists[i]));
    } else if (lists[i].endsWith(accept)) {
      ret.push(lists[i]);
    };

  };

  return ret;

};
