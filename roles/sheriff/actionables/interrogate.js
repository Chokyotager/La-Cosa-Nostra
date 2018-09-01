var rs = require("../../../rolesystem/rolesystem.js");

var responses = {
  neutral: ":mag: Your is a __Neutral__.",
  cult: ":mag: Your target belongs to the __Cult__.",
  mafia: ":mag: Your target is a member of the __Mafia__.",
  town: ":mag: Your target is not suspicious.",

  role: ":mag: Your target is a **{;role}**."
}

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Sheriff-interrogation"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  // Check roles
  var immunity = target.getStat("detection-immunity", Math.max);

  // Not immune
  if (immunity < 1) {

    if (target.role["reveal-role-on-interrogation"] === true) {
      var response = responses["town"].replace(new RegExp("{;role}", "g"), target.role["role-name"]);;
      game.addMessage(from, response);
    } else {
      var response = responses[target.role.alignment];
      game.addMessage(from, response ? response : responses["town"]);  
    };

  } else {
    // Show Town
    game.addMessage(from, responses["town"]);
  };

};
