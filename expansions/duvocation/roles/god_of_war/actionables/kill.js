var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var random = Math.random();

  var user = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  var private_channel = user.getPrivateChannel();
  var target_channel = target.getPrivateChannel();
  var main_channel = game.getMainChannel();

  if (target.hasAttribute("prosperity_charm")) {

    user.getPrivateChannel().send(":exclamation: The execution of **" + target.getDisplayName() + "** failed!");
    user.misc.forgeries_left--;

    var attributes = target.attributes;

    attributes.sort((a, b) => a.expiry - b.expiry);

    for (var i = 0; i < attributes.length; i++) {

      if (attributes[i].identifier !== "prosperity_charm") {
        continue;
      };

      if (typeof attributes[i].tags.amount === "number") {
        attributes[i].tags.amount--;
      };

      if (attributes[i].tags.amount < 1) {
        // Remove
        attributes.splice(i, 1);

        if (!target.hasAttribute("prosperity_charm")) {
          game.actions.delete(x => x.identifier === "a/prosperity_charm/charm" && x.from === actionable.from);
          game.actions.delete(x => x.identifier === "a/prosperity_charm/attacked" && x.from === actionable.from);
          return true;
        };

        return true;
      };

    };

  };

  rs.prototypes.unstoppableAttack.reason = "killed by the __God of War__";

  var outcome = rs.prototypes.unstoppableAttack(...arguments);

  private_channel.send(":exclamation: You killed **" + target.getDisplayName() + "**!");
  target_channel.send(":exclamation: You were executed!");
  main_channel.send(":crossed_swords: **" + user.getDisplayName() + "** yells a battle cry and races across the area. With a single swing they kill **" + target.getDisplayName() + "**.");

  user.misc.executions--;

  game.save();

  var tvl = false
  if (game.config.game.lynch["top-voted-lynch"]) {
    var tvl = true;
    game.config.game.lynch["top-voted-lynch"] = false;
  };

  game.fastforward();

  if (tvl) {
    game.config.game.lynch["top-voted-lynch"] = true;
  };

  // Always return true for instant triggers to null the action
  return true;

};

module.exports.TAGS = ["visit", "day_action"];
