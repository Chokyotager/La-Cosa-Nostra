// Register heal

module.exports = function (game, message, params) {
  // Run checks, etc
  console.log("Running");

  message.channel.send("Pass");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CAN_USE = false;
module.exports.ALIVE_CAN_USE = true;
module.exports.DISALLOW_DAY = true;
