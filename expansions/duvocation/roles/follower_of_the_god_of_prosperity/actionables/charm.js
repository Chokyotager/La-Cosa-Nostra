var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Prosperity-charm-visit"});

  var target = game.getPlayerByIdentifier(actionable.to);
  var from = game.getPlayerByIdentifier(actionable.from);

  target.addAttribute("prosperity_charm", 2, {uses: 1});

  from.misc.charms_left--;

};

module.exports.TAGS = ["visit"];
