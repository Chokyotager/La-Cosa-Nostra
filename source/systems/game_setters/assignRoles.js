// IMPORTANT: assigning

var Player = require("../game_templates/Player.js");
var auxils = require("../auxils.js");
var expansions = require("../expansions.js");

module.exports = function (client, config) {
  // Role alphabets are assigned in order

  var playing = config["playing"];

  // Expansions
  for (var i = 0; i < expansions.length; i++) {

    var game_assign = expansions[i].scripts.game_assign;

    if (!game_assign) {
      continue;
    };

    playing = game_assign(playing) || playing;

  };

  // Enforce defaults on parameters if undefined
  var enforce_default = [{key: "players", liberal: false}, {key: "roles", liberal: true}, {key: "expansions", liberal: false}, {key: "shuffle", liberal: false}, {key: "flavour", liberal: true}];
  for (var i = 0; i < enforce_default.length; i++) {
    var enforce = enforce_default[i];
    if (enforce.liberal) {
      playing[enforce.key] = playing[enforce.key] || config["playing"][enforce.key];
    } else {
      playing[enforce.key] = config["playing"][enforce.key];
    };
  };

  // players mapped by IDs
  var players = playing["players"];

  var roles = playing["shuffle"] ? auxils.cryptographicShuffle(playing["roles"]) : playing["roles"];

  if (roles.length !== players.length) {
    var err = "Role length should be equal to number of players!";
    throw new Error(err);
  };

  var ret = new Array();

  // Check accommodation
  if (playing["players"].length > 26) {
    // Cannot accommodate
    var err = config["game"]["players"] + " exceeds slots bot can accommodate for!";
    throw new Error(err);
  };

  for (var i = 0; i < players.length; i++) {

    // Should be only place where the name is assigned
    var alphabet = String.fromCharCode(65 + i);

    // Possible alternative:
    // {identifier, flavour_identifier, display_secondary, attributes: [{identifier, expiry, tags}]}

    var role = roles[i];
    var base_identifier = role.identifier || role;

    // Assign respective roles
    player = new Player().init(players[i], alphabet, base_identifier.toLowerCase());

    if (role instanceof Object) {

      if (role.flavour_identifier) {
        player.setBaseFlavourIdentifier(role.flavour_identifier);
      };

      if (role.display_secondary) {
        player.setDisplaySecondary(role.display_secondary);
      };

      if (role.attributes) {
        for (var j = 0; j < role.attributes.length; j++) {
          var attribute = role.attributes[j];
          player.addAttribute(attribute.identifier, attribute.expiry, attribute.tags);
        };
      };

    };

    ret.push(player);

  };

  return ret;

};
