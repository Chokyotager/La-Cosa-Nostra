// Accounts for the flavours API

var fs = require("fs");

var ret = new Object();

var flavours_dir = __dirname + "/../flavours/";

if (!fs.existsSync(flavours_dir)) {

  fs.mkdirSync(flavours_dir);
  console.log("[Error] Flavours folder not found, made one instead!");

};

var flavours = fs.readdirSync(flavours_dir);

for (var i = 0; i < flavours.length; i++) {

  if (!fs.lstatSync(flavours_dir + flavours[i]).isDirectory()) {
    continue;
  };

  var flavour = flavours[i];
  var directory = flavours_dir + flavour;

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
