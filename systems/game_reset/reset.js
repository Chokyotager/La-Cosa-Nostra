var removeRoles = require("./removeRoles.js");
var resetNicks = require("./resetNicks.js");
var deleteTimer = require("./deleteTimer.js");

module.exports = async function (client, config) {
  await deleteTimer(client, config);
  await resetNicks(client, config);
  await removeRoles(client, config);

  await client.user.setPresence({
    status: "online",
    game: {name: "La Cosa Nostra", type: "PLAYING"}
  });

};
