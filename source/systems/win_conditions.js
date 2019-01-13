var fs = require("fs");

var expansions = require("./expansions.js");
var auxils = require("./auxils.js");

var ret = new Object();
var scripts_dir = __dirname + "/../role_win_conditions/";

var scripts = fs.readdirSync(scripts_dir).map(x => "lcn/" + x);

var rules = new Array();

// Add expansions
for (var i = 0; i < expansions.length; i++) {

  scripts = scripts.concat(expansions[i].additions.role_win_conditions.map(x => expansions[i].identifier + "/" + x));
  rules = rules.concat(expansions[i].expansion.overrides.role_win_conditions);

};

scripts = auxils.ruleFilter(scripts, rules);

for (var i = 0; i < scripts.length; i++) {

  var script_info = scripts[i].split("/");

  var expansion = script_info[0];
  var script = script_info[1];

  if (expansion === "lcn") {

    var directory = scripts_dir + "/" + script;

  } else {

    var directory = __dirname + "/../../expansions/" + expansion + "/role_win_conditions/" + script;

  };

  if (!scripts[i].endsWith(".js")) {
    continue;
  };

  var runnable = require(directory);

  var key = script.substring(0, script.length - 3);

  ret[key] = runnable;

};

module.exports = ret;
