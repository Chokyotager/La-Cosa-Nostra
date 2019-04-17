var removeRoles = require("./removeRoles.js");
var resetNicks = require("./resetNicks.js");
var deleteTimer = require("./deleteTimer.js");
var deleteCaches = require("../game_setters/deleteCaches.js");

module.exports = async function (client, config) {
  await deleteTimer(client, config);
  await resetNicks(client, config);
  await removeRoles(client, config);

  deleteCaches(client, config);

  process.setStatus(client);

};
