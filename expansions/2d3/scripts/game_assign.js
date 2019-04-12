var logger = process.logger;

var lcn = require("../../../source/lcn.js");
var auxils = lcn.auxils;

var setups = {

  "A1": ["mafia_goon", "mafia_roleblocker", "cop", "neapolitan"],
  "A2": ["mafia_goon", "mafia_roleblocker", "jailkeeper", "doctor"],
  "A3": ["mafia_goon", "mafia_roleblocker", "doctor", "cop"],

  "B1": ["mafia_goon", "mafia_rolecop", "cop", "tracker"],
  "B2": ["mafia_goon", "mafia_rolecop", "jailkeeper", "tracker"],
  "B3": ["mafia_goon", "mafia_rolecop", "doctor", "neapolitan"],

  "C1": ["mafia_goon", "mafia_goon", "cop"],
  "C2": ["mafia_goon", "mafia_goon", "jailkeeper"],
  "C3": ["mafia_goon", "mafia_goon", "doctor", "tracker"]

};

module.exports = function (playing_config) {

  if (playing_config.roles) {
    logger.log(2, "[2d3] Not running setup randomiser as roles have been defined.");

    var override = {flavour: "2d3"};
    return lcn.auxils.objectOverride(playing_config, override);
  };

  var index = auxils.cryptographicChoice(Object.keys(setups));
  var setup = setups[index];

  logger.log(2, "[2d3] Running setup %s. [%s]", index, setup.join(", "));

  var townies = new Array(9 - setup.length).fill("vanilla_townie");
  setup = setup.concat(townies);

  var override = {roles: setup, flavour: "2d3"};

  return lcn.auxils.objectOverride(playing_config, override);

};
