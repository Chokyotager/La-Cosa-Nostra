var reader = require("./__reader.js");
var fs = require("fs");

var main = reader("commands_", ".js");

var roles_dir = __dirname + "/../roles";

// Add extra role game commands
var roles = fs.readdirSync(roles_dir);

// Build framework properties
main.role = new Object();

for (var i = 0; i < roles.length; i++) {
  // Role commands should be unique

  if (!fs.existsSync(roles_dir + "/" + roles[i] + "/game_commands/")) {
    continue;
  };

  var commands = fs.readdirSync(roles_dir + "/" + roles[i] + "/game_commands/");

  for (var j = 0; j < commands.length; j++) {
    if (commands[j].endsWith(".js")) {
      var key = commands[j].substring(0, commands[j].length - 3);

      if (main.role[key] === undefined) {

        // Framework function
        main.role[key] = function (game, message, params) {
          var user = message.author;
          var player = game.getPlayerById(user.id);

          if (player === null) {
            message.channel.send(":x: You are not registered in the game!");
            return null;
          };

          // Check properties

          var properties = arguments.callee.properties;

          var fails = new Array();

          for (var i = 0; i < properties.length; i++) {

            // Check available properties
            // Prepare for massive enumeration!
            var result = propertyEnumerator(game, message, properties[i]);

            if (result.outcome) {
              properties[i].runnable(...arguments);
              break;
            } else {
              fails.push(result.reason);
            };

          };

          if (fails.length > 0) {
            // Broadcast fail message

            switch (fails[fails.length - 1]) {
              case "ALLOW_NONSPECIFIC":
                message.channel.send(":x: You cannot use that command!");
                break;

              case "DEAD_CANNOT_USE":
                message.channel.send(":x: You are dead and cannot use that command!");
                break;

              case "ALIVE_CANNOT_USE":
                message.channel.send(":x: That command can only be used by the dead!");
                break;

              case "PRIVATE_ONLY":
                message.channel.send(":x: That command cannot be used here.");
                break;

              case "DISALLOW_DAY":
                message.channel.send(":x: That command cannot be used during the day!");
                break;

              case "DISALLOW_NIGHT":
                message.channel.send(":x: That command cannot be used during the night!");
                break;

              default:
                message.channel.send(":x: Cannot execute the command!");
                break;
            };

          };

        };

        main.role[key].properties = new Array();

      };

      main.role[key].properties.push({command: key,
        role: roles[i],
        runnable: require(roles_dir + "/" + roles[i] + "/game_commands/" + commands[j])});

    };
  };

};

module.exports = main;

function propertyEnumerator (game, message, property) {

  var user = message.author;
  var player = game.getPlayerById(user.id);

  if (player === null) {
    return {outcome: false};
  };

  // Same role

  var same_role = player.role_identifier.toLowerCase() === property.role.toLowerCase();
  var alive = player.status.alive;

  var private_channel = message.channel.id === player.channel.id;

  var day = game.period % 2 === 0;

  // In order of priority!
  var enumerated = [
    {name: "PRIVATE_ONLY", condition: private_channel, a: true, b: false},
    {name: "ALLOW_NONSPECIFIC", condition: same_role, a: false, b: false},
    {name: "DEAD_CANNOT_USE", condition: !alive, a: true, b: true},
    {name: "ALIVE_CANNOT_USE", condition: alive, a: true, b: true},
    {name: "DISALLOW_NIGHT", condition: !day, a: true, b: true},
    {name: "DISALLOW_DAY", condition: day, a: true, b: true}
  ];

  for (var i = 0; i < enumerated.length; i++) {
    var key = enumerated[i].name;

    var set = property.runnable[key] && true;

    var a = set === enumerated[i].a;
    var b = enumerated[i].condition === enumerated[i].b;

    if (a && b) {

      return {outcome: false, reason: key};

    };
  };

  return {outcome: true};

};
