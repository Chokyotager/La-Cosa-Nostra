var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var random = Math.random();

  var shooter = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  var private_channel = shooter.getPrivateChannel();
  var target_channel = target.getPrivateChannel();
  var main_channel = game.getMainChannel();

  rs.prototypes.powerfulAttack.reason = "shot by a __Dayshooter__";

  var outcome = rs.prototypes.powerfulAttack(...arguments);

  if (!outcome) {

    private_channel.send(":exclamation: Your target could not be shot!");
    target_channel.send(":exclamation: You were shot but you survived the attack!");
    main_channel.send(":gun: **" + shooter.getDisplayName() + "** tried to shoot somebody, but it failed!");

  } else {

    private_channel.send(":exclamation: You shot your target!");
    target_channel.send(":exclamation: You were shot!");
    main_channel.send(":gun: **" + shooter.getDisplayName() + "** fires a shot at **" + target.getDisplayName() + "**, and they fall on the ground, dead.");

    target.setDisplayRole("Hidden");

    game.addAction("one_shot_dayshooter/reveal_role", ["cycle"], {
      name: "Dayshooter-reveal",
      expiry: 1,
      from: target,
      to: target
    });

  };

  shooter.misc.dayshooter_bullets--;

  game.save();

  // Always return true for instant triggers to null the action
  return true;

};

module.exports.TAGS = ["visit", "day_action"];
