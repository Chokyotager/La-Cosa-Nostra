module.exports = function (permissions) {

  var keys = Object.keys(permissions);

  var ret = {
    allow: new Array(),
    deny: new Array()
  };

  for (var i = 0; i < keys.length; i++) {
    if (permissions[keys[i]] === true) {
      ret.allow.push(keys[i]);
    } else if (keys[i] === false) {
      ret.deny.push(keys[i]);
    };
  };

  return ret;

};
