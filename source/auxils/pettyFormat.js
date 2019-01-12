// Format arrays into gramatically correct ones

module.exports = function (array) {

  // Clone array
  var array = Array.from(array);

  if (array.length > 1) {
    array[array.length - 1] = "and " + array[array.length - 1];
  };

  return array.join(", ");

};
