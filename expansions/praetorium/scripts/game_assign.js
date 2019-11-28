var logger = process.logger;
var fs = require("fs");

var lcn = require("../../../source/lcn.js");
var auxils = lcn.auxils;

var role_table = JSON.parse(fs.readFileSync(__dirname + "/role_table.json"));

module.exports = function (playing_config) {

  if (playing_config.roles) {
    logger.log(2, "[Praetorium] Not running setup randomiser as roles have been defined.");

    var override = {flavour: "praetorium"};
    return lcn.auxils.objectOverride(playing_config, override);
  };

  // Define setup

  var setup = ["praetor", "cleric", "quaestor", "mason", "mason"];

  var outcome = auxils.cryptoRandom();
  if (outcome < 0.5) {
    // Has arsonist
    setup.push({"identifier": "arsonist", "attributes": [{"identifier": "apostate"}]});

    // Pick from matrix

    var combined = role_table.concat(rotate(role_table));
    setup = setup.concat(auxils.cryptographicChoice(combined));
  } else {

    // Liquid state generation
    var role_info = lcn.roles;
    var town_roles = new Array();
    var other_roles = new Array();

    for (var i = 0; i < role_table.length; i++) {

      for (var j = 0; j < role_table[i].length; j++) {

        if (typeof role_table[i][j] === "string") {
          var identifier = role_table[i][j];
        } else {
          var identifier = role_table[i][j].identifier;
        };

        if (role_info[identifier].role.alignment.toLowerCase() === "town") {
          town_roles.push(role_table[i][j]);
        } else {
          other_roles.push(role_table[i][j]);
        };

      };

    };

    // Pick three Town, two non-Town

    var town_to_pick = 3;
    for (var i = 0; i < town_to_pick; i++) {
      var role = auxils.cryptographicChoice(town_roles);
      setup.push(role);
    };

    var non_town_to_pick = 2;
    for (var i = 0; i < non_town_to_pick; i++) {
      var role = auxils.cryptographicChoice(other_roles);
      setup.push(role);
    };

  };

  logger.log(2, "[Praetorium] Running setup with power roles: %s", setup);

  // Flush setup with vanilla townies
  var townies = new Array(19 - setup.length).fill("vanilla_townie");
  setup = setup.concat(townies);

  var override = {roles: setup, flavour: "praetorium"};

  return lcn.auxils.objectOverride(playing_config, override);

};

function rotate(matrix) {

    var result = [];

    for (var i = 0; i < matrix[0].length; i++) {
        var row = matrix.map(x => x[i]).reverse();
        result.push(row);
    };

    return result;

};
