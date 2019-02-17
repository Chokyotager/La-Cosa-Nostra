var expansions = require("../expansions.js");

module.exports = function (config) {

  // Per MDN documentation
  var new_config = JSON.parse(JSON.stringify(config));
  var playing = new_config.playing;

  // Expansions
  for (var i = expansions.length - 1; i >= 0; i--) {
    var game_assign = expansions[i].scripts.game_assign;
    if (!game_assign) {
      continue;
    };

    playing = game_assign(playing) || playing;
    break;

  };

  // Enforce defaults on parameters if undefined
  var enforce_default = [{key: "players", liberal: false}, {key: "roles", liberal: true}, {key: "expansions", liberal: false}, {key: "shuffle", liberal: false}, {key: "flavour", liberal: true}];
  for (var i = 0; i < enforce_default.length; i++) {
    var enforce = enforce_default[i];
    if (enforce.liberal) {
      playing[enforce.key] = new_config["playing"][enforce.key] || playing[enforce.key];
    } else {
      playing[enforce.key] = new_config["playing"][enforce.key];
    };
  };

  new_config["playing"] = playing;

  return new_config;

};
