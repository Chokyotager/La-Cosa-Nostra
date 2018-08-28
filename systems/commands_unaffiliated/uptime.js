var auxils = require("../auxils.js");

module.exports = function (message, params, config) {
  message.channel.send(":clock: Current uptime: **" + auxils.formatDate(process.uptime() * 1000) + "**.");
};
