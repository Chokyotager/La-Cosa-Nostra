module.exports = function (x) {

  // Using standard modern Fisher-Yates (Durstenfeld) shuffling
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

  // Array is duplicated
  ret = Array.from(x);

  for (var i = ret.length - 1; i > 0; i--) {

      var j = Math.floor(Math.random() * (i + 1));
      [ret[i], ret[j]] = [ret[j], ret[i]];

  };

  return ret;

};
