var deleteTimer = require("../game_reset/deleteTimer.js");
var deleteCaches = require("../game_setters/deleteCaches.js");

module.exports = function (client, config) {
  
  deleteTimer(client, config);
  deleteCaches(client, config);

  console.log(uninstantiated);

};
