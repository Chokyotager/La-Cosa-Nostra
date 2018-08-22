module.exports = function flipObject (object) {
  var entries = Object.entries(object);
  var ret = new Object();

  for (var i = 0; i < entries.length; i++) {
    ret[entries[i][1]] = entries[i][0];
  };

  return ret;

};
