var deleteTimer = require("../game_reset/deleteTimer.js");
var deleteCaches = require("../game_setters/deleteCaches.js");

module.exports = function (client, config) {
  deleteTimer(client, config);

  client.user.setPresence({
    status: "online",
    game: {name: "Game unloaded", type: "PLAYING"}
  });

};
