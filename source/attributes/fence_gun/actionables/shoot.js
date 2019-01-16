var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var random = Math.random();

  var shooter = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  var private_channel = shooter.getPrivateChannel();
  var target_channel = target.getPrivateChannel();
  var main_channel = game.getMainChannel();

  rs.prototypes.basicAttack.reason = "publicly shot by someone possessing a gun";

  var outcome = rs.prototypes.basicAttack(...arguments);

  if (!outcome) {
    private_channel.send(":exclamation: Your target could not be shot!");
    target_channel.send(":exclamation: You were shot but you survived the attack!");
    main_channel.send(":gun: **" + shooter.getDisplayName() + "** shot, but nobody fell!");
  } else {
    private_channel.send(":exclamation: You shot your target!");
    target_channel.send(":exclamation: You were shot!");
    main_channel.send(":gun: **" + shooter.getDisplayName() + "** fired their gun, and the body of **" + target.getDisplayName() + "** falls on the ground.");
  };

  shooter.deleteAttribute(x => x.identifier === "fence_gun");

  game.save();

  // Always return true for instant triggers to null the action
  return true;

};

module.exports.TAGS = ["visit", "day_action"];
