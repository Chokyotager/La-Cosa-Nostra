// Executes BEFORE introduction

module.exports = function (player) {

  var config = player.game.config;

  var prefix = config["command-prefix"];

  player.addIntroMessage(":zap: This is a directory for limited-use abilities:\n\n:one: `" + prefix + "ability <ability name>`: provides the information associated with a limited-use ability.\n:two: `" + prefix + "listabilities`: lists all the **non-passive** limited-use abilities you have at the time of execution. May only be run in your private channel.");

  player.misc.can_pick = true;

  var abilities = player.attributes.filter(x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "ability");

  abilities.sort((a, b) => a.tags.uses - b.tags.uses);

  if (abilities.length > 0) {

    abilities = abilities.map((x, i) => (i+1) + ". " + x.attribute.name + " [x " + x.tags.uses + "]");
    player.addIntroMessage(":exclamation: You currently have the following limited-use abilities (both **non-passive** and **passive**):\n\n```fix\n" + abilities.join("\n") + "\n```\nTo obtain information on a power and how to use it, use `!ability <power name>`.");

  } else {

    player.addIntroMessage(":exclamation: You have no limited-use abilities (both **non-passive** and **passive**).");

  };

  player.misc.strongkills_left = 1;

};
