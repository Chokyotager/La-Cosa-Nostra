var protBase = require("../../../rolesystem/prototypes/increase_immunity.js");

module.exports = function (actionable, game, params) {
  protBase(arguments);

  var from = game.getPlayerByAlphabet(actionable.from);
  var to = game.getPlayerByAlphabet(actionable.to);

  if (to.status.roleblocked) {
    return null;
  };

  // Add message
  game.addAction("doctor/prot_message", ["attacked"], {
    name: "Doc-prot-success-message",
    from: actionable.from,
    to: actionable.to,
    expiry: 1
  });

};
