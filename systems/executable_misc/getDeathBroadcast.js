// Return the death broadcast

var format = require("./__formatter.js");
var texts = require("./text/texts.js");

module.exports = function (game, role, reason) {
  var message = texts.death_broadcast;

  var member = game.getGuildMember(role.id);

  message = message.replace(new RegExp("{;player}", "g"), member.displayName);
  message = message.replace(new RegExp("{;reason}", "g"), reason);
  message = message.replace(new RegExp("{;role}", "g"), role.display_role);

  var will = "We could not find a last will.";

  if (role.will !== undefined) {
    will = role.will;
  };

  message = message.replace(new RegExp("{;will_message}", "g"), will);

  // Remove trailing
  message = message.replace(new RegExp("[\n]*$", "g"), "");

  return message;

};
