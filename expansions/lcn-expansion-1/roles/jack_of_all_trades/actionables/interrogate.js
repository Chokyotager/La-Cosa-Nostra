var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

var responses = {
  neutral: ":mag: Your target is a __Neutral__.",
  cult: ":mag: Your target belongs to the __Cult__.",
  mafia: ":mag: Your target is a member of the __Mafia__.",
  town: ":mag: Your target is not suspicious.",

  role: ":mag: Your target is a **{;role}**."
}

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "JOAT-interrogation"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  // Check roles
  var immunity = target.getStat("detection-immunity", Math.max);

  // Not immune
  if (immunity < 1) {

    // Vagrant
    if (target.role_identifier === "vagrant") {
      game.addMessage(from, responses["mafia"]);
      return null;
    };

    if (target.role["reveal-role-on-interrogation"] === true) {
      var response = responses["role"].replace(new RegExp("{;role}", "g"), target.role["role-name"]);;
      game.addMessage(from, response);
    } else {
      var response = responses[target.role.alignment];
      game.addMessage(from, response ? response : responses["town"]);
    };

  } else {
    // Show Town
    game.addMessage(from, responses["town"]);
  };

  if (target.isAlive()) {
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
