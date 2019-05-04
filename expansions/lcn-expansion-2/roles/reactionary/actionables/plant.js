var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

var text = {
  vowels: ["a", "e", "i", "o", "u"],
  consonants: ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"]
};

module.exports = function (actionable, game, params) {

  // Generate context
  var difficulty = Math.round(Math.random() * 7) + 5;

  var fulfil = Math.min(Math.floor((12 - difficulty) / 2) + 2, difficulty);

  if (fulfil > 3) {

    var vowels_allowed = fulfil - 3;

    var consonants = auxils.shuffle(text.consonants).splice(0, fulfil + Math.min(2 - vowels_allowed, 0));
    var vowels = auxils.shuffle(text.vowels).splice(0, vowels_allowed);

    var letters = consonants.concat(vowels).sort();

  } else {

    var letters = auxils.shuffle(text.consonants).splice(0, fulfil + 2).sort();

  };

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Reactionary-plant"});

  game.addAction("reactionary/detonate", ["chat"], {
    name: "Reactionary-detonate",
    from: actionable.from,
    to: actionable.to,
    context: {difficulty: difficulty, fulfil: fulfil, letters: letters},
    expiry: 2
  });

  game.addAction("reactionary/defused_message", ["cycle"], {
    name: "Reactionary-defused-message",
    from: actionable.from,
    to: actionable.to,
    expiry: 2,
    execution: 2,
    tags: ["astral"]
  });

  var attacker = game.getPlayerByIdentifier(actionable.from);

  attacker.getPrivateChannel().send(":bomb: The minimum word length is **" + difficulty + "**, the letters are " + auxils.pettyFormat(letters.map(x => "`" + x + "`")) + ", of which your target needs to say at least **" + fulfil + "** to explode.");

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
