var lcn = require("../../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  var cabinet_alive = game.findAll(x => x.role["win-condition"] === "praetorium" && x.isAlive());

  if (cabinet_alive.filter(x => x.role_identifier !== "praetor").length < 1) {

    // Destroy
    var praetorium_members = game.findAll(x => x.isAlive() && x.role.alignment === "praetorium");

    console.log(praetorium_members);

    for (var i = 0; i < praetorium_members.length; i++) {

      var member = praetorium_members[i];

      if (member.role_identifier === "praetor") {

        game.kill(member, "__dethroned and executed__", "__dethroned and executed__", 1);

      } else {

        game.kill(member, "__executed__", "__executed__");

      };

    };

    return null;

  };

};
