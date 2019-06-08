// Accounts for the flavours API

var logger = process.logger;

var fs = require("fs");

var expansions = require("./expansions.js");
var auxils = require("./auxils.js");

var ret = new Object();

var flavours_dir = __dirname + "/../flavours/";

if (fs.existsSync(flavours_dir)) {
  var flavours = fs.readdirSync(flavours_dir).map(x => "lcn/" + x);
} else {
  var flavours = new Array();
};

var rules = new Array();

// Add expansions
for (var i = 0; i < expansions.length; i++) {

  flavours = flavours.concat(expansions[i].additions.flavours.map(x => expansions[i].identifier + "/" + x));
  rules = rules.concat(expansions[i].expansion.overrides.flavours);

};

flavours = auxils.ruleFilter(flavours, rules);

for (var i = 0; i < flavours.length; i++) {

  var flavour_info = flavours[i].split("/");

  var expansion_identifier = flavour_info[0];
  var flavour = flavour_info[1];

  if (expansion_identifier === "lcn") {

    var directory = flavours_dir + "/" + flavour;

  } else {

    var expansion = expansions.find(x => x.identifier === expansion_identifier);
    var directory = expansion.expansion_directory + "/flavours/" + flavour;

  };

  if (!fs.lstatSync(directory).isDirectory()) {
    continue;
  };

  // Scan the system
  var info = JSON.parse(fs.readFileSync(directory + "/info.json"));
  var roles = JSON.parse(fs.readFileSync(directory + "/roles.json"));
  var asset_swaps = JSON.parse(fs.readFileSync(directory + "/asset-swaps.json"));
  var assets = new Object();

  var assets_dir = directory + "/assets/";

  // List assets
  if (fs.existsSync(assets_dir) && fs.lstatSync(assets_dir).isDirectory()) {

    var listed = fs.readdirSync(assets_dir);

    for (var j = 0; j < listed.length; j++) {
      assets[listed[j]] = attemptRead(assets_dir + listed[j]);
    };

  };

  var all_flavours = new Object();
  var keys = Object.keys(roles);

  for (var j = 0; j < keys.length; j++) {
    var available = roles[keys[j]];

    for (var k = 0; k < available.length; k++) {
      all_flavours[available[k].name] = available[k];
      available[k].role = keys[j];
    };

  };

  ret[flavour] = {
    info: info,
    roles: roles,
    assets: assets,
    flavours: all_flavours,
    asset_swaps: asset_swaps
  };

};

module.exports = ret;

function attemptRead (directory) {
  var available = fs.existsSync(directory);

  if (available) {

    return fs.readFileSync(directory);

  } else {
    return undefined;
  };

};
