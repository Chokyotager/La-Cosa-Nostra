// Return the death broadcast

var format = require("./__formatter.js");
var texts = require("./text/texts.js");

module.exports = function (game, role, reason) {
  var message = texts.death_broadcast;

  message = message.replace(new RegExp("{;player}", "g"), role.getDisplayName());
  message = message.replace(new RegExp("{;reason}", "g"), reason);
  message = message.replace(new RegExp("{;role}", "g"), role.getDisplayRole());

  if (game.config["game"]["last-wills"]["allow"]) {
    var will = "We could not find a last will.";

    var defined_will = role.getWill();

    if (defined_will !== undefined) {
      will = "We found a will next to their body:\n```fix\n" + defined_will + "```";
    };

    message = message.replace(new RegExp("{;will_message}", "g"), will);
  } else {
    message = message.replace(new RegExp("{;will_message}", "g"), "");
  };

  // Remove trailing
  message = message.replace(new RegExp("[\n]*$", "g"), "");

  return message;

};
