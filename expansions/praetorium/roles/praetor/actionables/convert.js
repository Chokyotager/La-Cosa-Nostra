var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Work in progress
  var target = game.getPlayerByIdentifier(actionable.to);
  var praetor = game.getPlayerByIdentifier(actionable.from);

  var pushable = {interval: game.period, successful: null, target: target.identifier};

  if (target.hasAttribute("apostate")) {
    pushable.successful = false;
    pushable.blocker = target.identifier;
    praetor.misc.praetor_conversions.push(pushable);
    return null;
  };

  // Convert
  if (target.role.alignment === "praetorium") {
    pushable.successful = false;
    pushable.blocker = target.identifier;
    praetor.misc.praetor_conversions.push(pushable);
    return null;
  };

  target.role.alignment = "praetorium";
  target.role["win-condition"] = "deviant_praetorium";

  target.misc.praetorium_converted = true;

  game.addMessage(target, ":candle: You have been converted to be a recruited member of the Praetorium.");

  pushable.successful = true;
  praetor.misc.praetor_conversions.push(pushable);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
