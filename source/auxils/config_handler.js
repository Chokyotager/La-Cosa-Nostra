var fs = require("fs");

module.exports = function (file_dir="configuration.json") {

  /*Read the base config file as specified;
  merge other configurations and return
  one JSON object*/

  var base_config = JSON.parse(fs.readFileSync(__dirname + "/../../configs/" + file_dir));

  var config_pieces = base_config["merge-configs"];
  var combination = new Array();

  for (var i = 0; i < config_pieces.length; i++) {
    combination.push(JSON.parse(fs.readFileSync(__dirname + "/../../configs/" + config_pieces[i])));
  };

  return Object.assign(base_config, ...combination);

};
