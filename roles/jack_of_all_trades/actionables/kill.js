var rs = require("../../../rolesystem/rolesystem.js");

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {

  rs.prototypes.basicAttack.reason = "shot by a __Neutral__";

  var outcome = rs.prototypes.basicAttack(...arguments);

  var from = game.getPlayerByIdentifier(actionable.from);

  if (!outcome) {

    var to = game.getPlayerByIdentifier(actionable.to);

    game.addMessage(from, ":exclamation: Your target could not be attacked last night!");

  } else {

    game.addMessage(from, ":exclamation: You successfully executed your action!");
    from.misc.joat_actions_left--;

  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
