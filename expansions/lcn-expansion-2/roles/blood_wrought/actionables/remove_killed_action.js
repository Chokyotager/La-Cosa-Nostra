module.exports = function (actionable, game, params) {

  game.actions.delete(x => x.from === actionable.from && x.identifier === "blood_wrought/killed");

  return true;

};
