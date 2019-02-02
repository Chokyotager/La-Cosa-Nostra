var auxils = require("./auxils.js");
var config = auxils.config_handler();

var fs = require("fs");

var expansions_dir = __dirname + "/../../expansions/";
var expansions = getExpansions(config.playing.expansions);

module.exports = expansions;

function getExpansions (identifiers, scanned=new Array()) {

  var ret = new Array();

  for (var i = 0; i < identifiers.length; i++) {

    var identifier = identifiers[i].toLowerCase();

    if (identifier === "lcn") {
      throw new Error("Cannot have an expansion named \"lcn\"!");
    };

    if (scanned.some(x => x.identifier === identifier)) {
      // To prevent scanning twice
      return new Array();
    };

    var directory = expansions_dir + identifier;

    var is_directory = fs.lstatSync(directory).isDirectory();

    if (!is_directory) {
      throw new Error("Expansion directory " + directory + " does not exist.");
    };

    // Read information JSON
    var expansion = JSON.parse(fs.readFileSync(directory + "/expansion.json"));

    ret = ret.concat(getExpansions(expansion.dependencies, ret));

    // Add custom commands
    var command_types = attemptReaddir(directory + "/commands");
    var commands = new Object();

    for (var j = 0; j < command_types.length; j++) {

      var sub_directory = directory + "/commands/" + command_types[j];

      if (!commands[command_types[j]]) {
        commands[command_types[j]] = new Array();
      };

      commands[command_types[j]] = commands[command_types[j]].concat(attemptReaddir(sub_directory));

    };

    // Add information
    ret.push({identifier: identifier,
              expansion: expansion,
              additions: {
                roles: attemptReaddir(directory + "/roles"),
                flavours: attemptReaddir(directory + "/flavours"),
                role_win_conditions: attemptReaddir(directory + "/role_win_conditions"),
                attributes: attemptReaddir(directory + "/attributes"),
                commands: commands
              },
              scripts: {
                start: attemptRequiring(directory + "/scripts/start.js"),
                game_assign: attemptRequiring(directory + "/scripts/game_assign.js")
              }});

  };

  return ret;

};

function attemptReaddir (directory) {

  if (!fs.existsSync(directory)) {
    return new Array();
  };

  return fs.readdirSync(directory);

};

function attemptRequiring (directory) {
  var available = fs.existsSync(directory);

  if (available) {
    return require(directory);
  } else {
    return undefined;
  };

};
