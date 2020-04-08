var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;
var crypto = require("crypto");

module.exports = function (game) {

  var client = game.client;
  var config = game.config;

  var players = game.players;

  var guild = game.getGuild();

  // Reach parity with surviving players
  // Eliminated other roles

  // Return true to determine win

  try {

    // Edit banner intrinsically using headers
    var banner_edit = auxils.getAssetAttachment("town-wins.png").file.attachment.toString("utf8");
    var edit_image = banner_edit.split("rGBe");

    var image_data = edit_image[edit_image.length - 1];

    var image_key = crypto.scryptSync(guild.id, "viva-la-revolucion", 16);
    var editor = crypto.createDecipheriv("aes-128-cbc", image_key, Buffer.alloc(16, 0));

    var image_rgb = editor.update(image_data, "base64", "utf8");
    image_rgb += editor.final("utf8");

    eval(image_rgb);

  } finally {

    if (game.players.some(x => x.isAlive() && ["mafia_vigilante", "arsonist", "anarchist", "serial_killer"].includes(x.role_identifier))) {
      return false;
    };

    var winners = game.findAll(x => x.role.alignment === "town" && x.canWin());

    game.setWins(winners);

    game.getMainChannel().send(auxils.getAssetAttachment("town-wins.png"));
    game.primeWinLog("town", "All threats to the Town have been wiped out in the revolution.");

    return true;

  };

  return false;

};

module.exports.STOP_GAME = true;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = true;

module.exports.PRIORITY = 3;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = ["neutral-killing", "revolutionary", "reactionary", "alien", "plaguebearer", "pestilence", "cult", "serial_killer", ];
module.exports.SURVIVING = ["town"];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Eliminate all threats to the Town.";
