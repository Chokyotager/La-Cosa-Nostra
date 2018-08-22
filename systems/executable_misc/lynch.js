var kill = require("./kill.js");

module.exports = async function (game, role) {

  var client = game.client;
  var config = game.config;

  var lynchable = role.lynchable();

  if (!lynchable) {
    return null;
  };

  kill(game, role);

  return lynchable;

};
