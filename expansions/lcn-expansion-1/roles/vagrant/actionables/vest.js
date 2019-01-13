var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Vagrant seen as self-visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Vagrant-self-visit"});

  // Increase immunity
  rs.prototypes.powerfulDefense(...arguments);

  // Add killing action
  game.addAction("vagrant/attacked", ["attacked"], {
    name: "Vagrant-attacked",
    expiry: 1,
    from: actionable.from,
    to: actionable.from,
    priority: 10
  });

  var vagrant = game.getPlayerByIdentifier(actionable.from);

  vagrant.misc.vagrant_vest_uses--;

};

module.exports.TAGS = ["roleblockable", "visit"];
