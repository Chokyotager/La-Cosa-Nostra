module.exports = async function (game, presence) {

  var client = game.client;

  await client.user.setPresence(presence);

};
