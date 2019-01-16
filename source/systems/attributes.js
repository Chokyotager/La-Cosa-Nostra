var fs = require("fs");

var expansions = require("./expansions.js");
var auxils = require("./auxils.js");

var attributes_dir = __dirname + "/../attributes";
var attributes = fs.readdirSync(attributes_dir).map(x => "lcn/" + x);

var rules = new Array();

// Add expansions
for (var i = 0; i < expansions.length; i++) {

  attributes = attributes.concat(expansions[i].additions.attributes.map(x => expansions[i].identifier + "/" + x));
  rules = rules.concat(expansions[i].expansion.overrides.attributes);

};

attributes = auxils.ruleFilter(attributes, rules);

var ret = new Object();

for (var i = 0; i < attributes.length; i++) {

  var attribute_info = attributes[i].split("/");

  var expansion = attribute_info[0];
  var attribute = attribute_info[1];

  if (expansion === "lcn") {

    var directory = attributes_dir + "/" + attribute;

  } else {

    var directory = __dirname + "/../../expansions/" + expansion + "/attributes/" + attribute;

  };

  var usable = new Object();

  usable.directory = directory;

  usable.attribute = attemptGetting(directory + "/attribute.json");

  usable.start = attemptRequiring(directory + "/general/start.js");
  usable.routines = attemptRequiring(directory + "/general/routines.js");

  ret[attribute] = usable;

};

module.exports = ret;

function attemptRequiring (directory) {
  var available = fs.existsSync(directory);

  if (available) {
    return require(directory);
  } else {
    return undefined;
  };

};

function attemptGetting (directory) {
  var available = fs.existsSync(directory);

  if (available) {
    return JSON.parse(fs.readFileSync(directory));
  } else {
    return undefined;
  };

};
