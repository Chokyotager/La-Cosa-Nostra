var logger = process.logger;

var lcn = require("../../../source/lcn.js");
var auxils = lcn.auxils;

var town_configuration = {

  "P": {
    "1": ["bulletproof"],
    "2": ["bodyguard"],
    "3": ["bodyguard", "bulletproof"],
    "4": ["doctor"],
    "5": ["doctor", "bulletproof"],
    "6": ["doctor", "bodyguard"]
  },

  "I": {
    "1": ["two_shot_cop"],
    "2": ["two_shot_cop"],
    "3": ["cop"],
    "4": ["cop", "miller"],
    "5": ["cop", "deputy", "miller"],
    "6": ["cop", "deputy", "miller"]
  },

  "S": {
    "1": ["tracker"],
    "2": ["tracker"],
    "3": ["tracker"],
    "4": ["watcher"],
    "5": ["watcher"],
    "6": ["watcher", "tracker"]
  },

  "K": {
    "1": ["bomb"],
    "2": ["one_shot_vigilante"],
    "3": ["one_shot_vigilante"],
    "4": ["two_shot_vigilante"],
    "5": ["two_shot_vigilante"],
    "6": ["vigilante"]
  }

};

// In order of priority
var mafia_configuration = [
  {letter: "P", minimum: 6, role: "mafia_strongman"},
  {letter: "S", minimum: 4, role: "mafia_jailer"},
  {letter: "I", minimum: 3, role: "mafia_godfather"},
  {letter: "S", minimum: 5, role: "mafia_rolecop"},
  {letter: "K", minimum: 5, role: "mafia_bulletproof"},
  {letter: "P", minimum: 3, role: "mafia_hooker"},
  {letter: "S", minimum: 3, role: "mafia_two_shot_janitor"},
  {letter: "I", minimum: 2, role: "mafia_neapolitan"},
  {letter: "K", minimum: 3, role: "mafia_doctor"}
];

var fields = Object.keys(town_configuration);

module.exports = function (playing_config) {

  if (playing_config.roles) {
    logger.log(2, "[PISK] Not running setup randomiser as roles have been defined.");

    var override = {flavour: "pisk"};
    return lcn.auxils.objectOverride(playing_config, override);
  };

  var setup = new Array();
  var letters = new Array();

  // Determine the Town PRs
  for (var field in town_configuration) {

    var numeral = Math.ceil(auxils.cryptoRandom() * fields.length);

    // Add roles
    setup = setup.concat(town_configuration[field][numeral.toString()]);
    letters = letters.concat(numeral);

  };

  // Determine number of scum PRs
  var letter_count = letters.reduce((a, b) => a + b);

  var mafia_prs = 0;

  switch (true) {

    case letter_count < 7:
      mafia_prs = 1;
      setup = setup.concat(["mafia_goon", "mafia_goon", "mafia_goon"]);
      break;

    case letter_count < 10:
      mafia_prs = 2;
      setup = setup.concat(["mafia_goon", "mafia_goon"]);
      break;

    case letter_count < 16:
      mafia_prs = 3;
      setup = setup.concat(["mafia_goon"]);
      break;

    case letter_count < 18:
      mafia_prs = 3;
      setup = setup.concat(["mafia_goon", "serial_killer"]);
      break;

    case letter_count < 24:
      mafia_prs = 4;
      setup = setup.concat(["mafia_goon", "serial_killer"]);
      break;

  };

  // Determine Mafia PRs
  for (var i = 0; i < mafia_configuration.length; i++) {

    if (mafia_prs < 1) {
      break;
    };

    // Add power role
    var index = fields.indexOf(mafia_configuration[i].letter);
    if (letters[index] >= mafia_configuration[i].minimum) {

      // Add role
      setup = setup.concat(mafia_configuration[i].role);
      mafia_prs--;

    };

  };

  while (mafia_prs > 0) {
    setup.push("mafia_goon");
    mafia_prs--;
  };

  // Fill with vanilla townies
  var townies = new Array(16 - setup.length).fill("vanilla_townie");

  logger.log(2, "[PISK] Running setup: {%s}", auxils.pettyFormat(setup));

  setup = setup.concat(townies);

  var override = {roles: setup, flavour: "pisk"};

  return lcn.auxils.objectOverride(playing_config, override);

};
