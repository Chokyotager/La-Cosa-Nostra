// IMPORTANT: assigning

var Player = require("../game_templates/Player.js");
var auxils = require("../auxils.js");

module.exports = function (client, config) {
  // Role alphabets are assigned in order

  // players mapped by IDs
  var playing = config["playing"];
  var players = playing["players"];

  var guild = client.guilds.find(x => x.id === config["server-id"]);

  if (players === "auto") {

    var members = guild.members.filter(x => x.roles.some(y => y.name === config["permissions"]["pre"])).array();

    members.sort(function (a, b){
        if (a.displayName.toLowerCase() < b.displayName.toLowerCase()) { return -1; }
        if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) { return 1; }
        return 0;
    });

    players = members.map(x => x.id);

  };

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
