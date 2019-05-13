var lcn = require("../../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (message, params, config) {

  var phrases = [
    ":fish: **" + message.member.displayName + "**: POKE IS A FIIIIIIIIIIIIIISH.",
    ":chicken: **" + message.member.displayName + "**: ELLE IS A CHIIIIIICKENNNN FAAAAAARRRRRRMMEERRRRRRRRR.",
    ":frog: **" + message.member.displayName + "**: PSY IS A FROOOOOOOOOOOOOOOG.",
    ":musical_note: **" + message.member.displayName + "**: KO-KAKKKKKKKKKKKKKKK.",
  ];

  message.channel.send(auxils.choice(phrases));

};
