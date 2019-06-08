var beasts = [
  ":tiger:",
  ":bear:",
  ":lion_face:",
  ":boar:",
  ":wolf:",
  ":ram:",
  ":water_buffalo:",
  ":crocodile:",
  ":rhino:",
  ":gorilla:"
]

module.exports = function (prepend_space=false) {

  // Inserts a sarcastic remark

  var index = Math.floor(Math.random() * beasts.length);

  return prepend_space ? " " + beasts[index] : beasts[index];
};
