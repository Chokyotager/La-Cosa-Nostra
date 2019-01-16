var auxils = require("../auxils.js");

module.exports = function (message, params, config) {
  var current = new Date();

  message.channel.send(":clock12: Current time is **" + auxils.formatUTCDate(current) + "**.");
  
};
