module.exports = function (game, user_identifier, type) {

  game.actions.delete(x => x.meta.type === type && x.from === user_identifier);

};
