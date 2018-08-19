module.exports = function (level, message, fail_message, visitor, visitor_fail) {

  var ret = {

    action: function () {

      if (level > this.game_stats["basic-defense"]) {

        // Kill
        this.status.alive = false;
        this.broadcast_messages.push(message);

        // Wipe out all visitors

      } else {

        this.receive_messages.push(fail_message);

      };

    }

  };

  return ret;

};
