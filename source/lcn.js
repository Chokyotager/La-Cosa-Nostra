// NOTE: the order matters!

var config_handler = require("./systems/config_handler.js");
var fs = require("fs");

module.exports.auxils = require("./systems/auxils.js");
module.exports.expansions = require("./systems/expansions.js");
module.exports.rolesystem = require("./rolesystem/rolesystem.js");
module.exports.attributes = require("./systems/attributes.js");
module.exports.executable = require("./systems/executable.js");
module.exports.commands = require("./systems/commands.js");
module.exports.game = require("./systems/game.js");
module.exports.flavours = require("./systems/flavours.js");
module.exports.expansions = require("./systems/expansions.js");
module.exports.win_conditions = require("./systems/win_conditions.js");
module.exports.actionables = require("./systems/actionables.js");
module.exports.roles = require("./systems/roles.js");
module.exports.assets = require("./systems/assets.js");

var config = config_handler();
var default_config = config;

for (var i = 0; i < module.exports.expansions.length; i++) {

  var script = module.exports.expansions[i].scripts.start;

  if (!script) {
    continue;
  };

  // Run the script
  config = script(config) || config;

};

// Enforce defaults on parameters
var enforce_default = ["bot-token", "server-id", "command-prefix", "automatically-load-saves", "encode-cache", "merge-configs", "playing", "console-log-level", "file-log-level", "allow-config-override-subprocess"];

for (var i = 0; i < enforce_default.length; i++) {

  var key = enforce_default[i];
  config[key] = default_config[key];

  Object.defineProperty(config, key, {
    writable: false
  });

};

var hide_properties = ["bot-token"];

for (var i = 0; i < hide_properties.length; i++) {

  var key = enforce_default[i];

  Object.defineProperty(config, key, {
    enumerable: false
  });

};

module.exports.config = config;
