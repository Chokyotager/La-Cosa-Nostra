module.exports = async function (game) {

  if (game.channels.mafia !== undefined) {

    var channel = game.getChannel("mafia");
    
    var mafia = game.exists(x => x.role["see-mafia-chat"] === true && x.isAlive());

    if (mafia) {
      await channel.send("~~                                              ~~    **" + game.getFormattedDay() + "**");
    };

  };

};
