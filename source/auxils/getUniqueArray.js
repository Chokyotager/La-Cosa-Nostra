module.exports = function (array) {

  var ret = new Array();

  for (var i = 0; i < array.length; i++) {
    if (!ret.includes(array[i])) {
      ret.push(array[i]);
    };
  };

  return ret;

};
