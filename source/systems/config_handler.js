var fs = require("fs");
var objectOverride = require("../auxils/objectOverride.js");

module.exports = function (file_dir="configuration.json", allow_parent_override=true) {

  /*Read the base config file as specified;
  merge other configurations and return
  one JSON object*/

  var base_config = JSON.parse(fs.readFileSync(__dirname + "/../../configs/" + file_dir));

  var config_pieces = base_config["merge-configs"];
  var combination = new Array();

  for (var i = 0; i < config_pieces.length; i++) {
    combination.push(JSON.parse(fs.readFileSync(__dirname + "/../../configs/" + config_pieces[i])));
  };

  if (allow_parent_override && process.parent_data) {

    var parent_config = process.parent_data.parent_config;

    var override = objectOverride(Object.assign(base_config, ...combination), parent_config);

    return override;

  };

  return Object.assign(base_config, ...combination);

};
