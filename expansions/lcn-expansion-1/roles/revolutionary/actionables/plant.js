var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var getWord = require("../miscellaneous/getWord.js");

module.exports = function (actionable, game, params) {

  var word = getWord();

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Rev-plant"});

  game.addAction("revolutionary/detonate", ["chat"], {
    name: "Rev-detonate",
    from: actionable.from,
    to: actionable.to,
    word: word,
    expiry: 2
  });

  game.addAction("revolutionary/defused_message", ["cycle"], {
    name: "Rev-defused-message",
    from: actionable.from,
    to: actionable.to,
    expiry: 2,
    execution: 2,
    tags: ["astral"]
  });

  var attacker = game.getPlayerByIdentifier(actionable.from);

  attacker.getPrivateChannel().send(":bomb: The word for detonation for your tag is __" + word + "__.");

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
