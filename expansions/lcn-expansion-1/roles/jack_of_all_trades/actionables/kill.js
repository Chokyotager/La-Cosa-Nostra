var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

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

  game.addAction("jack_of_all_trades/remove_on_win", ["cycle"], {
    name: "JOAT-remove-on-win",
    expiry: 1,
    from: actionable.from,
    to: actionable.to
  });

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
