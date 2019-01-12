var pinMessage = require("./pinMessage.js");

module.exports = async function (game) {

  if (game.channels.mafia !== undefined) {

    var channel = game.getChannel("mafia");

    var mafia = game.exists(x => x.see_mafia_chat === true && x.isAlive());

    if (mafia) {
      var message = await channel.send("~~                                              ~~    **" + game.getFormattedDay() + "**");
      await pinMessage(message);
    };

  };

};
