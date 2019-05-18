// Enumerate roles
var fs = require("fs");

var expansions = require("./expansions.js");
var auxils = require("./auxils.js");

var ret = new Object();

// Read files [role]/[actions]/<name>
// Enumerate as [role]-<name>

var root = __dirname + "/../roles";

var roles = fs.readdirSync(root).map(x => "lcn/" + x);
var rules = new Array();

// Add expansions
for (var i = 0; i < expansions.length; i++) {

  roles = roles.concat(expansions[i].additions.roles.map(x => expansions[i].identifier + "/" + x));
  rules = rules.concat(expansions[i].expansion.overrides.roles);

};

roles = auxils.ruleFilter(roles, rules);

for (var i = 0; i < roles.length; i++) {

  var role_info = roles[i].split("/");

  var expansion_identifier = role_info[0];
  var role = role_info[1];

  if (expansion_identifier === "lcn") {

    var directory = root + "/" + role;

  } else {

    var expansion = expansions.find(x => x.identifier === expansion_identifier);
    var directory = expansion.expansion_directory + "/roles/" + role;

  };

  if (fs.lstatSync(directory).isDirectory()) {

    // Read information file
    var info = attemptRead(directory + "/info.json", true);
    var description = attemptRead(directory + "/description.txt");
    var role_json = attemptRead(directory + "/role.json", true);
    var routine = attemptRequiring(directory + "/general/routines.js");
    var start = attemptRequiring(directory + "/general/start.js");

    if (!role_json) {
      var err = new Error(role + "'s role.json does not exist!");
      throw err;
    };

    ret[role] = {
      directory: directory,
      role: role_json,
      description: description,
      info: info,
      routine: routine,
      start: start
    };

    // Get role card
    if (fs.existsSync(directory + "/role_card.png")) {
      ret[role].role_card = new Promise(function(resolve, reject) {
        fs.readFile(directory + "/role_card.png", (err, data) => {

          if (err) {reject(data);};

          resolve(Buffer.from(data));

        });
      });
    };

  };

};

module.exports = ret;

function attemptRead (directory, parse=false) {
  var exists = fs.existsSync(directory);

  if (exists) {
    var ret = fs.readFileSync(directory, "utf8");

    if (parse) {
      return JSON.parse(ret);
    } else {
      return ret;
    };

  } else {
    return null;
  };

};

function attemptRequiring (directory) {
  var available = fs.existsSync(directory);

  if (available) {
    return require(directory);
  } else {
    return undefined;
  };

};
