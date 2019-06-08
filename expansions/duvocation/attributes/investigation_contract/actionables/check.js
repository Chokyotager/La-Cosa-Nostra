var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

var responses = {
  neutral: ":mag: Your contractee's target is a __Neutral__.",
  mafia: ":mag: Your contractee's target is __Mafia__.",
  town: ":mag: Your contractee's target is __Town__.",

  role: ":mag: Your contractee's target's role is **{;role}**."
};

module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  var contractor = game.getPlayerByIdentifier(from.attributes.find(x => x.identifier === "investigation_contract").tags.contractor);

  game.execute("visit", {visitor: contractor.identifier,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Investigation-contract"});

  // Check roles
  var immunity = target.getStat("detection-immunity", Math.max);

  // Not immune
  if (immunity < 1) {

    if (target.role["reveal-role-on-interrogation"] === true) {
      var response = responses["role"].replace(new RegExp("{;role}", "g"), target.role["role-name"]);;
      game.addMessage(contractor, response);
    } else {
      var response = responses[target.role.alignment];
      game.addMessage(contractor, response ? response : responses["town"]);
    };

  } else {
    // Show Town
    game.addMessage(contractor, responses["town"]);
  };

};

module.exports.TAGS = ["drivable", "roleblockable"];
