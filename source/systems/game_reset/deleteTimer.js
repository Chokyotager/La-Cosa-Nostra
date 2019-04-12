var logger = process.logger;

module.exports = function (client, config) {

  if (process.timer) {
    process.timer.destroy();

    delete process.timer;

    logger.log(2, "Destroyed previous Timer instance.");
  };

};
