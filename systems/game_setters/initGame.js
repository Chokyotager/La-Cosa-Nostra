// Main functional
var assignRoles = require("./assignRoles.js");
var createGame = require("./createGame.js");
var initCache = require("./initCache.js");
var createPrivate = require("./createPrivate.js");
var deletePrivate = require("./deletePrivate.js");
var setPermissions = require("./setPermissions.js");
var nicknameAndRole = require("./nicknameAndRole.js");
var deleteCaches = require("./deleteCaches.js");
var setRolePermissions = require("./setRolePermissions.js");

module.exports = async function (client, config) {

  await client.user.setPresence({
    status: "dnd",
    game: {name: "setting up...", type: "PLAYING"}
  });

  // Destroy previous timer
  if (process.timer) {
    process.timer.destroy();

    delete process.timer;

    console.log("Destroyed previous Timer instance.");
  };

  await deletePrivate(client, config);

  // Delete (or rename) previous cache
  deleteCaches(client, config);

  // Initialise cache
  initCache(client, config);

  // assign roles first
  var roles = assignRoles(client, config);

  // Create private channels
  var [mafia_channel, private_channels] = await createPrivate(client, config, roles);

  nicknameAndRole(client, config, roles);
  await setPermissions(client, config, roles);
  await setRolePermissions(client, config);

  var [game, timer] = createGame(client, config, roles, mafia_channel);

  // create test vote
  //game.createVotes("development-chambers");

  // Save serialised code in base64
  // with reference tags

  timer.save();

  process.timer = timer;

  await client.user.setPresence({
    status: "online",
    game: {name: "readying...", type: "PLAYING"}
  });

  return timer;

};
