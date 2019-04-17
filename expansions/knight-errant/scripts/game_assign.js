var logger = process.logger;
var fs = require("fs");

var lcn = require("../../../source/lcn.js");
var auxils = lcn.auxils;

var role_table = JSON.parse(fs.readFileSync(__dirname + "/role_table.json"));

// Transpose
role_table = role_table[0].map((col, i) => role_table.map(row => row[i]));

module.exports = function (playing_config) {

  if (playing_config.roles) {
    logger.log(2, "[Knight-Errant] Not running setup randomiser as roles have been defined.");

    var override = {flavour: "knight-errant"};
    return lcn.auxils.objectOverride(playing_config, override);
  };

  // Default setup
  var setup = ["mason", "mason", "mafia_goon", "mafia_goon"];

  // Choose from role table using knight move
  var possibilities = knightMatrix([4, 4], [2, 1]);

  var choice = auxils.cryptographicChoice(possibilities);

  var concatenable = new Array();

  for (var i = 0; i < choice.positions.length; i++) {

    var position = choice.positions[i];
    concatenable.push(role_table[position[0]][position[1]]);

  };

  var roles = concatenable.map(x => x["role-identifier"]);
  var abilities = concatenable.map(x => x.ability);

  setup = setup.concat(roles);

  var unique = auxils.getUniqueArray(abilities);

  var attributes = new Array();
  for (var i = 0; i < unique.length; i++) {

    attributes.push({identifier: unique[i], tags: {uses: abilities.filter(x => x === unique[i]).length}});

  };

  var serial_killer = {identifier: "serial_killer", attributes: attributes};

  setup.push(serial_killer);

  var townies = new Array(18 - setup.length).fill("vanilla_townie");
  setup = setup.concat(townies);

  logger.log(2, "[Knight-Errant] Running setup: %s [%s]", choice.name, auxils.pettyFormat(roles));

  var override = {roles: setup, flavour: "knight-errant"};

  return lcn.auxils.objectOverride(playing_config, override);

};

var out = knightMatrix([4, 4], [2, 1]);

// Code by Kroppeb, modified by ChocoParrot
function knightMatrix (dimensions=[4, 4], move_directions=[2, 1]) {

  // Enumerate axes
  var arx = [
      [
          {"letter": "R", "axis": 0, "direction": 1},
          {"letter": "L", "axis": 0, "direction": -1}
      ],
      [
          {"letter": "D", "axis": 1, "direction": 1},
          {"letter": "U", "axis": 1, "direction": -1}
      ],
  ];

  var start_pos = dimensions.map(i => Math.floor(i * auxils.cryptoRandom(60, 60)));

  var total_moves = move_directions.reduce((a, b) => a + b);

  var moves = new Array();

  function isValidLocation(pos) {

      return pos.every((val, i) => 0 <= val && val < dimensions[i]);

  };

  function doStep (axis, pos, step=0, name=new String(), combination_indices=new Array()) {

      if (step >= move_directions.length) {
          combination_indices.push(pos);
          moves.push({name: name, positions: combination_indices});
          return null;
      };

      arx[axis].forEach(move => {

          new_pos = Array.from(pos);
          new_pos[axis] += move.direction * move_directions[step];

          if (isValidLocation(new_pos)) {

            var combination_pos = [pos];

            for (var i = 1; i < move_directions[step]; i++) {

              var intermediate_pos = Array.from(pos);

              intermediate_pos[axis] += move.direction * i;

              combination_pos.push(intermediate_pos);

            };

            var new_indices = combination_indices.concat(combination_pos);

            doStep(1 - axis, new_pos, step + 1, name + move.letter, new_indices);

          };

      });

  };

  for (var i = 0; i < arx.length; i++) {

    doStep(i, start_pos);

  };

  return moves.map(steps => ({name: String.fromCharCode(start_pos[0] + 65) + (start_pos[1] + 1) + "-" + steps.name, positions: steps.positions}));

};
