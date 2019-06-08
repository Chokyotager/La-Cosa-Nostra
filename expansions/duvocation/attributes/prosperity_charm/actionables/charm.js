var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  // Protection order: control, roleblock, death, God of Lies, God of War

  var holder = game.getPlayerByIdentifier(actionable.from);

  // Night action order
  var order = [{identifier: "mafia_follower_of_the_chaos_god/control", minimum: 1}, {identifier: "a/blessing_restraint/bless", minimum: 2}, {identifier: "a/curse_restraint/roleblock", minimum: 1}];

  for (var i = 0; i < order.length; i++) {

    var actions = game.actions.findAll(x => x.identifier === order[i].identifier && x.to === actionable.from);

    if (actions.length > order[i].minimum) {

      var attributes = holder.attributes;

      for (var j = 0; j < actions.length; j++) {

        game.execute("roleblock", {roleblocker: actionable.from,
          target: actions.from,
          priority: actionable.priority,
          reason: "Unknown-god-roleblock"});

        game.getPlayerByIdentifier(actions.from).setStatus("roleblocked", true);

      };

      game.actions.delete(x => x.identifier === order[i].identifier && x.to === actionable.from);

      attributes.sort((a, b) => a.expiry - b.expiry);

      for (var j = 0; j < attributes.length; j++) {

        if (attributes[j].identifier !== "prosperity_charm") {
          continue;
        };

        if (typeof attributes[j].tags.amount === "number") {
          attributes[j].tags.amount--;
        };

        if (attributes[j].tags.amount < 1) {
          // Remove
          attributes.splice(j, 1);

          if (!holder.hasAttribute("prosperity_charm")) {
            game.actions.delete(x => x.identifier === "a/prosperity_charm/attacked" && x.from === actionable.from);
            return true;
          };

        };

      };

    };

  };

};
