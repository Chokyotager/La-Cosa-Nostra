var logger = process.logger;

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
var configModifier = require("./configModifier.js");

module.exports = async function (client, config) {

  await client.user.setPresence({
    status: "dnd",
    game: {name: "setting up...", type: "PLAYING"}
  });

  // Destroy previous timer
  if (process.timer) {
    process.timer.destroy();

    delete process.timer;

    logger.log(2, "Destroyed previous Timer instance.");
  };

  var new_config = configModifier(config);

  // assign roles first
  var roles = assignRoles(client, new_config);

  await deletePrivate(client, new_config);

  // Delete (or rename) previous cache
  deleteCaches(client, new_config);

  // Initialise cache
  initCache(client, new_config);

  // Create private channels
  var [mafia_channel, private_channels] = await createPrivate(client, new_config, roles);

  await nicknameAndRole(client, new_config, roles);
  await setPermissions(client, new_config, roles);
  await setRolePermissions(client, new_config);

  var [game, timer] = await createGame(client, new_config, roles, mafia_channel);

  // create test vote
  //game.createVotes("development-chambers");

  // Save serialised code in base64
  // with reference tags

  timer.save();

  game.postPrimeLog();

  logger.log(2, "Game Timer instance created.");

  process.timer = timer;

  return timer;

};
