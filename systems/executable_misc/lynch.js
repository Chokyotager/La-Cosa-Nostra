module.exports = async function (game, role) {

  var client = game.client;
  var config = game.config;

  var lynchable = role.lynchable();

  if (!lynchable) {
    return false;
  };

  var lynches = Array.from(role.votes);

  game.execute("lynch", {target: role.identifier, votes: lynches});

  return lynchable;

};
