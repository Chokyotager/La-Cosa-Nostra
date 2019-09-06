var lcn = require("../../../../../source/lcn.js");
var rs = lcn.rolesystem;

var auxils = lcn.auxils;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  var from = game.getPlayerById(message.author.id);

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "cloak <role name>` instead!");
    return null;
  };

  var role_info = lcn.roles;
  var flavours = lcn.flavours;
  var flavour_identifier = game.flavour_identifier;

  var roles = new Array();
  for (var key in role_info) {

    var role = role_info[key];

    if (flavour_identifier && flavours[flavour_identifier]["roles"][key]) {

      var flavour_role = flavours[flavour_identifier]["roles"][key];

      for (var i = 0; i < flavour_role.length; i++) {

        roles.push({role_identifier: key,
          name: flavour_role[i].name || role.role["role-name"],
          description: flavour_role[i].description || role.description,
          role_card: flavours[flavour_identifier].assets[flavour_role[i].banner] || role.role_card,
          flavour: true,
          role: role
        });

      };

      continue;

    };

    roles.push({role_identifier: key,
      name: role.role["role-name"],
      description: role.description,
      flavour: false,
      role_card: role.role_card,
      role: role
    });

  };

  var cloak_role = null;

  var distances = new Array();
  for (var i = 0; i < roles.length; i++) {
    var distance = auxils.hybridisedStringComparison(params[0].toLowerCase(), roles[i].role_identifier.toLowerCase());
    distances.push(distance);
  };

  var best_match_index = distances.indexOf(Math.max(...distances));
  var score = distances[best_match_index];

  var role = roles[best_match_index];

  if (score < 0.7 || role.role_identifier === "quaestor") {
    game.addAction("quaestor/cloak", ["cycle"], {
      name: "Quaestor-Cloak",
      expiry: 1,
      from: message.author.id,
      to: message.author.id,
      cloak: null
    });

    message.channel.send(":butterfly: You have decided not to cloak into any role.");
    return null;
  };

  game.addAction("quaestor/cloak", ["cycle"], {
    name: "Quaestor-Cloak",
    expiry: 1,
    from: message.author.id,
    to: message.author.id,
    cloak: role
  });

  message.channel.send(":butterfly: You have decided to appear as: **" + role.name + "**.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = false;
module.exports.DISALLOW_NIGHT = false;
