var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Null actions if roleblocked
  var inclusive = ["a/curse_vigour", "a/curse_security"];

  var action = game.actions.find(x => x.from === actionable.from && inclusive.includes(x.identifier));

  if (action) {

    // Do stuff
    rs.modular.attributeDecrement({
      from: actionable.from,
      identifier: action.identifier
    }, game, params);

  };

};
