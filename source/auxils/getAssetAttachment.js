var Discord = require("discord.js");

module.exports = function (asset_name) {

  var assets = require("../systems/assets.js");

  // Check flavour assets
  if (process.timer) {

    var flavour = process.timer.game.getGameFlavour();

    if (flavour) {
      var swaps = flavour["asset_swaps"];

      for (var i = 0; i < swaps.length; i++) {
        if (swaps[i].from === asset_name) {
          var attachment = new Discord.Attachment(flavour.assets[swaps[i].to], swaps[i].to);
          return attachment;
        };
      };
    };

  };

  var attachment = new Discord.Attachment(assets[asset_name], asset_name);
  return attachment;
};
