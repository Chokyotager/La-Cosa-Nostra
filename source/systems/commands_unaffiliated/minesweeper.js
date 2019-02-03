var auxils = require("../auxils.js");

module.exports = async function (message, params, config) {

  var width = params[0] !== undefined ? parseInt(params[0]) : 8;
  var height = params[1] !== undefined ? parseInt(params[1]) : 8;
  var bombs = params[2] !== undefined ? parseInt(params[2]) : 10;

  if (isNaN(width) || isNaN(height) || isNaN(bombs)) {
    await message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "minesweeper [width] [height] [bombs]` instead!");
    return null;
  };

  var area = width * height;

  if (area > 300) {

    await message.channel.send(":x: That's too big an area!");
    return null;

  };

  if (bombs >= area) {

    await message.channel.send(":x: You cannot have more bombs than the total area!");
    return null;

  };

  var array = new Array(width);

  // Form the array
  for (var i = 0; i < array.length; i++) {
    array[i] = new Array(height).fill(0);
  };

  // Distribute the bombs
  while (bombs > 0) {

    var index = Math.floor(Math.random() * area);

    var x = Math.floor(index / height);
    var y = index % height;

    if (array[x][y] !== -1) {
      array[x][y] = -1;
      bombs--;

      // +1 to nearby grids
      for (var i = -1; i < 2; i++) {

        if (!array[x + i]) {
          continue;
        };

        for (var j = -1; j < 2; j++) {

          if ((array[x + i][y + j] === undefined) || array[x + i][y + j] === -1) {
            continue;
          };

          array[x + i][y + j]++;

        };

      };

    };

  };

  // Post minesweeper
  var emotes = {
    "-1": ':bomb:',
    "0": ':zero:',
    "1": ':one:',
    "2": ':two:',
    "3": ':three:',
    "4": ':four:',
    "5": ':five:',
    "6": ':six:',
    "7": ':seven:',
    "8": ':eight:'
  };

  for (var i = 0; i < width; i++) {

    for (var j = 0; j < height; j++) {

      array[i][j] = "||" + emotes[array[i][j].toString()] + "||";

    };

  };

  var sendable = array.map(x => x.join("")).join("\n");

  if (sendable.length >= 2000) {

    await message.channel.send(":x: That's too big an area!");
    return null;

  };

  await message.channel.send(sendable);

};
