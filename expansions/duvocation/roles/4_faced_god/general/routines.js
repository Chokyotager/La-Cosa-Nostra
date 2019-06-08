var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;
var attributes = lcn.attributes;

module.exports = function (player) {

  var game = player.game;
  var config = game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  // Scout of blessings
  var followers = game.findAll(x => x.isAlive() && x.role_identifier === "follower_of_3");
  var blessings_count = new Object();

  for (var i = 0; i < followers.length; i++) {
    var blessings = followers[i].attributes.filter(x => x.attribute.modular && x.attribute["modular-details"].cluster === "blessing");
    blessings.forEach(function (x) {

      if (!blessings_count[x.attribute.name]) {
        blessings_count[x.attribute.name] = new Number();
      };

      blessings_count[x.attribute.name]++;

    });
  };

  var blessings_map = new Array()
  for (var key in blessings_count) {
    blessings_map.push({name: key, count: blessings_count[key]});
  };

  blessings_map.sort((a, b) => a.count - b.count);
  blessings_map = blessings_map.map((x, i) => (i+1) + ". " + x.name + " [x " + x.count + "]");

  player.getPrivateChannel().send(":pray: You see that there are **" + followers.length + "** followers and they have the following blessings:\n\n```fix\n" + blessings_map.join("\n") + "\n```");

  var curses = player.attributes.filter(x => x.attribute.modular && x.attribute["modular-details"]["cluster"] === "curse");

  curses.sort((a, b) => a.tags.uses - b.tags.uses);

  if (curses.length > 0) {
    curses = curses.map((x, i) => (i+1) + ". " + x.attribute.name + " [x " + x.tags.uses + "]");

    game.sendPeriodPin(channel, ":candle: You currently have the following curses:\n\n```fix\n" + curses.join("\n") + "\n```\nYou may only use **one curse per night**. To obtain information on a curse and how to use it, use `!curse <curse name>`.");
  } else {

    game.sendPeriodPin(channel, ":candle: You have no curses left.");

  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
