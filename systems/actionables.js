var fs = require("fs");
var actionables = new Object();

var roles_dir = __dirname + "/../roles";
var roles = fs.readdirSync(roles_dir);

for (var i = 0; i < roles.length; i++) {

  var root = roles_dir + "/" + roles[i] + "/actionables";

  // Check exists
  var exists = fs.existsSync(root);
  if (!exists) {
    continue;
  };

  // Cycle and read
  var actions = cycle(root);

  for (var j = 0; j < actions.length; j++) {
    // -3 because of .js suffix
    var key = roles[i] + actions[j].substring(root.length, actions[j].length - 3);
    actionables[key] = require(actions[j]);
  };

};

var attributes_dir = __dirname + "/../attributes";
var attributes = fs.readdirSync(attributes_dir);

for (var i = 0; i < attributes.length; i++) {

  var root = attributes_dir + "/" + attributes[i] + "/actionables";

  // Check exists
  var exists = fs.existsSync(root);
  if (!exists) {
    continue;
  };

  // Cycle and read
  var actions = cycle(root);

  for (var j = 0; j < actions.length; j++) {
    // -3 because of .js suffix
    var key = "a/" + attributes[i] + actions[j].substring(root.length, actions[j].length - 3);
    actionables[key] = require(actions[j]);
  };

};

module.exports = actionables;

// Get a whole treeview of the roles
function cycle (directory, accept=".js") {

  var lists = fs.readdirSync(directory);
  var ret = new Array();

  lists = lists.map(x => directory + "/" + x);

  for (var i = 0; i < lists.length; i++) {

    // Recursively check
    if (fs.lstatSync(lists[i]).isDirectory()) {
      ret.push(cycle(lists[i]));
    } else if (lists[i].endsWith(accept)) {
      ret.push(lists[i]);
    };

  };

  return ret;

};
