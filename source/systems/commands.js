var reader = require("./__reader.js");
var fs = require("fs");

var main = reader("commands_", ".js");

var expansions = require("./expansions.js");

for (i = 0; i < expansions.length; i++) {

  var expansion = expansions[i];

  for (var key in expansion.additions.commands) {

    if (!main[key]) {
      main[key] = new Object();
    };

    var commands = expansion.additions.commands[key];

    var directory = __dirname + "/../../expansions/" + expansion.identifier + "/commands/" + key + "/";

    for (var j = 0; j < commands.length; j++) {

      if (!commands[j].endsWith(".js")) {
        continue;
      };

      var name = commands[j].substring(0, commands[j].length - 3);
      main[key][name] = attemptRequiring(directory + commands[j]);

    };

  };

};

// Build framework properties
main.role = new Object();

var roles = require("./roles.js");
var attributes = require("./attributes.js");

for (var role in roles) {

  var directory = roles[role].directory + "/game_commands";

  var commands = cycle(directory);

  for (var i = 0; i < commands.length; i++) {

    var command = commands[i].split("/").pop();
    var key = command.substring(0, command.length - 3);

    if (main.role[key] === undefined) {

      // Framework function
      main.role[key] = getPlaceholderFunction();
      main.role[key].properties = new Array();

    };

    main.role[key].properties.push({command: key,
      role: role,
      runnable: require(commands[i])});

  };

};

for (var attribute in attributes) {

  var directory = attributes[attribute].directory + "/game_commands";

  var commands = cycle(directory);

  for (var i = 0; i < commands.length; i++) {

    var command = commands[i].split("/").pop();
    var key = command.substring(0, command.length - 3);

    if (main.role[key] === undefined) {

      // Framework function
      main.role[key] = getPlaceholderFunction();
      main.role[key].properties = new Array();

    };

    main.role[key].properties.push({command: key,
      attribute: attribute,
      runnable: require(commands[i])});

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

  var same_role = property.role !== undefined && player.role_identifier.toLowerCase() === property.role.toLowerCase();
  var has_attribute = player.hasAttribute(property.attribute);

  var same_role_or_attribute = same_role || has_attribute;

  var alive = player.status.alive;

  var private_channel = message.channel.id === player.channel.id;

  var day = game.period % 2 === 0;

  // In order of priority!
  var enumerated = [
    {name: "PRIVATE_ONLY", condition: private_channel, a: true, b: false},
    {name: "ALLOW_NONSPECIFIC", condition: same_role_or_attribute, a: false, b: false},
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

function getPlaceholderFunction () {

  return function commandPlaceholder (game, message, params) {
    var user = message.author;
    var player = game.getPlayerById(user.id);

    if (player === null) {
      //message.channel.send(":x: You are not registered in the game!");
      return null;
    };

    // Check properties

    var properties = commandPlaceholder.properties;

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

    if (fails.length === properties.length) {
      // Broadcast fail message

      /* Post the most liberal (lowest on list);
      deliberately conflicts enumeration order;
      allows for correct error message */
      var reasons = [
        {"key": "ALLOW_NONSPECIFIC", "reason": null},

        {"key": "DISALLOW_DAY", "reason": ":x: That command cannot be used during the day!"},
        {"key": "DISALLOW_NIGHT", "reason": ":x: That command cannot be used during the night!"},
        {"key": "DEAD_CANNOT_USE", "reason": ":x: You are dead and cannot use that command!"},
        {"key": "ALIVE_CANNOT_USE", "reason": ":x: That command can only be used by the dead!"},

        // Should reveal as little information as possible
        {"key": "PRIVATE_ONLY", "reason": null}
      ];

      var index = -1;
      for (var i = 0; i < fails.length; i++) {
        var value = reasons.findIndex(x => x.key === fails[i]);
        index = Math.max(value, index);
      };

      if (index < 0) {
        message.channel.send(":x: Cannot execute the command!");
      } else {

        if (reasons[index].reason) {
          message.channel.send(reasons[index].reason);
        };

      };

    };

  };

};

function cycle (directory, accept=".js") {

  if (!fs.existsSync(directory)) {
    return new Array();
  };

  var lists = fs.readdirSync(directory);
  var ret = new Array();

  lists = lists.map(x => directory + "/" + x);

  for (var i = 0; i < lists.length; i++) {

    // Recursively check
    if (fs.lstatSync(lists[i]).isDirectory()) {
      ret = ret.concat(cycle(lists[i]));
    } else if (lists[i].endsWith(accept)) {
      ret.push(lists[i]);
    };

  };

  return ret;

};

function attemptRequiring (directory) {
  var available = fs.existsSync(directory);

  if (available) {
    return require(directory);
  } else {
    return undefined;
  };

};
