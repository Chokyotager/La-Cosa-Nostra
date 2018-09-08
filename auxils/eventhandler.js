module.exports = function (client, config) {

  client.on("message", function (message) {
    if (process.timer) {
      process.timer.game.execute("chat", {message: message});
    };
  });

};
