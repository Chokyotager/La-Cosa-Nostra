var rs = require("../../../rolesystem/rolesystem.js");

var responses = {
  neutral: ":mag: Your target is a __Neutral__. Their role is **{;role}**.",
  cult: ":mag: Your target belongs to the __Cult__. Their role is **{;role}**.",
  mafia: ":mag: Your target is a member of the __Mafia__. Their role is **{;role}**.",
  town: ":mag: Your target appears to be part of the __Town__. Their role is **{;role}**.",

  role: ":mag: Your target's role is **{;role}**."
}

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Consigliere-investigation"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  // Goes through immunity
  if (target.role["reveal-role-on-interrogation"] === true) {
    var response = responses["role"].replace(new RegExp("{;role}", "g"), target.getDisplayRole(true));
    game.addMessage(from, response);
  } else {
    var response = responses[target.role.alignment];

    response = (response ? response : responses["town"]).replace(new RegExp("{;role}", "g"), target.getDisplayRole(false));

    game.addMessage(from, response);
  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
