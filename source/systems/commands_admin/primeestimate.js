var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  var timezone = config.time.timezone;

  var current = new Date();
  var utc_hour = current.getUTCHours();

  var now = new Date();

  current.setUTCHours(-timezone, 0, 0, 0);

  while (current.getTime() - now.getTime() < 0) {
    current.setUTCHours(current.getUTCHours() + 24);
  };

  var next_action = new Date(current);

  var display_timezone = timezone >= 0 ? "+" + timezone : timezone;

  var delta = current.getTime() - new Date().getTime();

  await message.channel.send(":ok: If the game is initialised now (UTC**" + display_timezone + "**), the game will start at **" + auxils.formatUTCDate(next_action) + "**, or in **" + auxils.formatDate(delta) + "**.");

};
