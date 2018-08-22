// IMPORTANT: assigning

var Player = require("../game_templates/Player.js");
var auxils = require("../auxils.js");

module.exports = function (client, config) {
  // Role alphabets are assigned in order


  // players mapped by IDs
  var players = config["playing"]["players"];
  var roles = config["playing"]["shuffle"] ? auxils.cryptographicShuffle(config["playing"]["roles"]) : config["playing"]["roles"];

  if (roles.length !== players.length) {
    var err = "Role length should be equal to number of players!";
    throw new Error(err);
  };

  var ret = new Array();

  // Check accommodation
  if (config["playing"]["players"].length > 26) {
    // Cannot accommodate
    var err = config["game"]["players"] + " exceeds slots bot can accommodate for!";
    throw new Error(err);
  };

  for (var i = 0; i < players.length; i++) {

    // Should be only place where the name is assigned
    var alphabet = String.fromCharCode(65 + i);

    // Assign respective roles
    player = new Player().init(players[i], alphabet, roles[i].toLowerCase());
    ret.push(player);

  };

  return ret;

};
