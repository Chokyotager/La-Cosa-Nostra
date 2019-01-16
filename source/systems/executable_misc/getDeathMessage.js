// Return the death broadcast

var format = require("./__formatter.js");
var texts = require("./text/texts.js");

module.exports = function (game, role, reason) {
  var message = texts.death_message;

  var member = role.getGuildMember();

  message = message.replace(new RegExp("{;player}", "g"), role.getDisplayName());
  message = message.replace(new RegExp("{;reason}", "g"), reason);
  message = message.replace(new RegExp("{;role}", "g"), role.getDisplayRole());

  var will = "We could not find a last will.";

  if (role.will !== undefined) {
    will = "We found a will next to their body:\n```fix\n" + role.will + "```";
  };

  message = message.replace(new RegExp("{;will_message}", "g"), will);

  // Remove trailing
  message = message.replace(new RegExp("[\n]*$", "g"), "");

  message = message.replace(new RegExp("{@player}", "g"), "<@" + role.id + ">");

  return message;

};
