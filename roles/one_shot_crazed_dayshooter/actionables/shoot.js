var rs = require("../../../rolesystem/rolesystem.js");

module.exports = function (actionable, game, params) {

  var random = Math.random();

  var shooter = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  var private_channel = shooter.getPrivateChannel();
  var target_channel = target.getPrivateChannel();
  var main_channel = game.getMainChannel();

  random = 0.2;

  if (random < 0.6) {
    rs.prototypes.powerfulAttack.reason = "shot by a __Crazed Dayshooter__";

    var outcome = rs.prototypes.powerfulAttack(...arguments);

    if (!outcome) {
      private_channel.send(":exclamation: Your target could not be shot!");
      target_channel.send(":exclamation: You were shot but you survived the attack!");
      main_channel.send(":gun: A gunshot rings through the air, but nobody fell!");
    } else {
      private_channel.send(":exclamation: You shot your target!");
      target_channel.send(":exclamation: You were shot!");
      main_channel.send(":gun: A gunshot rings through the air, and the body of **" + target.getDisplayName() + "** falls on the ground.");
    };

  } else if (random < 0.75) {

    rs.prototypes.basicAttack.reason = "was blown to bits from a gun explosion";

    var outcome = rs.prototypes.basicAttack({from: actionable.from, to: actionable.from}, game, params);

    if (!outcome) {
      private_channel.send(":exclamation: Your gun exploded but you survived it!");
      main_channel.send(":gun: A gunshot rings through the air, but nobody fell!");
    } else {
      private_channel.send(":exclamation: Your gun exploded!");
      main_channel.send(":gun: A gunshot rings through the air. **" + shooter.getDisplayName() + "** fell onto the floor. Their gun had exploded!");
    };

  } else {

    target.setGameStat("vote-magnitude", 0, "set");
    private_channel.send(":exclamation: You have injured your target!");
    target_channel.send(":exclamation: You were shot and injured!");
    main_channel.send(":gun: A gunshot rings through the air. **" + target.getDisplayName() + "** was wounded and their votes are nulled for today!");

    game.__reloadTrialVoteMessage();

  };

  //shooter.misc.crazed_dayshooter_bullets--;

  game.save();

  // Always return true for instant triggers to null the action
  return true;

};

module.exports.TAGS = ["visit", "day_action"];
