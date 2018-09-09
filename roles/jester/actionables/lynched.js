var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var self = game.getPlayerByIdentifier(actionable.from);

  self.misc.jester_lynched = true;
  self.misc.jester_lynchers = params.votes;

  self.getPrivateChannel().send(":black_joker: You successfully got yourself lynched!");

  return true;

};
