module.exports = function factorial (value) {

  if (value <= 1) {

    return 1;

  } else {

    return factorial(value - 1) * value;

  };

};
