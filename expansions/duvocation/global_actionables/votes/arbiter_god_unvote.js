module.exports = function (actionable, game, params) {

  var voter = game.getPlayerByIdentifier(params.voter);

  game.getMainChannel().send(":scales: **" + voter.getDisplayName() + "** has __revoked__ their vote against the **Arbiter God**.");

};
