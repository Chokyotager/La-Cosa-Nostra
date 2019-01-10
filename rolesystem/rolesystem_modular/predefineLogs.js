module.exports = function (player) {

  // Create a log if it does not exist
  if (!player.modular_log) {
    player.modular_log = new Array();
  };

  if (!player.modular_success_log) {
    player.modular_success_log = new Array();
  };

};
