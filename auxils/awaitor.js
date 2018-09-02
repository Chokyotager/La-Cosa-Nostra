module.exports = function (runnable, refuse, check=500, max=50) {

  if (typeof runnable !== "function") {
    var err = new Error("Runnable should be a function!");
    throw err;
  };

  if (!Array.isArray(refuse)) {
    var err = new Error("Refuse should be an array");
    throw err;
  }

  return new Promise(function(resolve, reject) {

    var counts = 0;

    var interval = setInterval(function () {

      // Check if value is out
      var current = runnable();
      if (!refuse.includes(current)) {
        clearInterval(interval);
        resolve(current);
      } else {

        counts++;

        if (counts > max) {
          clearInterval(interval);
          resolve(undefined);
        };

      };

    }, check);

  });
};
